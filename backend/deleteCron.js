const cron = require('cron');
const Coupon = require("./Schemas/coupon");


// Execute every day at midnight
const job = new cron.CronJob('0 0 * * *', async function () {
    console.log("Running cron job to delete expired bin coupons...");

    const retentionPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const cutoffDate = new Date(Date.now() - retentionPeriod);

    try {
        const result = await Coupon.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: cutoffDate }
        });
        console.log(`${result.deletedCount} expired coupons permanently removed.`);
    } catch (error) {
        console.error("Error during cron job to delete expired bin coupons:", error.message);
    }
});

module.exports = { job };
