const SubscriptionSchema = require("../schemas/subscriptionSchema");
const JobPostSchema = require("../schemas/jobPostsSchema");

const subscriptionCheck = async () => {
  const subscriptions = await SubscriptionSchema.find();
  const jobPosts = await JobPostSchema.find();

  let today = new Date();

  for (i = 0; i < subscriptions.length; i++) {
    if (subscriptions[i].expireDate < today) {
      await SubscriptionSchema.findOneAndUpdate({ _id: subscriptions[i]._id }, { $set: { status: "Expired" } });
    }
  }

  for (i = 0; i < jobPosts.length; i++) {
    if (!jobPosts[i].isQuotationAccepted && jobPosts[i].lastQuotationDate < today) {
      await JobPostSchema.findOneAndUpdate({ _id: jobPosts[i]._id }, { $set: { approvalStatus: "expired" } });
    }
  }
};

module.exports = { subscriptionCheck };
