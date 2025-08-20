import prisma from "../db";
import midtransclient from "midtrans-client";

export class PaymentsService {
    private snap = new midtransclient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    public async handleMidtransNotification(notification: any) {
        const statusResponse = await this.snap.transaction.notification(
            notification
        );
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        const booking = await prisma.booking.findUnique({
            where: { id: orderId },
        });
        if (!booking) return;

        if (
            transactionStatus == "capture" ||
            transactionStatus == "settlement"
        ) {
            if (fraudStatus == "accept") {
                await prisma.booking.update({
                    where: { id: orderId },
                    data: { status: "CONFIRMED" },
                });
            }
        } else if (
            transactionStatus == "cancel" ||
            transactionStatus == "deny" ||
            transactionStatus == "expire"
        ) {
            await prisma.booking.update({
                where: { id: orderId },
                data: { status: "CANCELLED" },
            });
        }
    }
}
