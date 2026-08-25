import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting payment records and financial metrics...");

  // 1. Delete all payment gateway transaction records
  const deletedPayments = await prisma.payment.deleteMany();
  console.log(`Cleared ${deletedPayments.count} payment audit log entries.`);

  // 2. Reset booking paid amounts & status
  const updatedBookings = await prisma.booking.updateMany({
    data: {
      paidAmount: 0,
      status: "PENDING",
    },
  });
  console.log(`Reset ${updatedBookings.count} booking paid amounts.`);

  // 3. Reset customer CRM total spent metrics
  const updatedCustomers = await prisma.customer.updateMany({
    data: {
      totalSpent: 0,
    },
  });
  console.log(`Reset ${updatedCustomers.count} customer CRM financial metrics.`);

  console.log("Payment reset completed successfully!");
}

main()
  .catch((e) => {
    console.error("Payment Reset Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
