const Lead = require("../models/Lead");
const Customer = require("../models/Customer");
const Installation = require("../models/Installation");
const Service = require("../models/Service");
const Product = require("../models/Product");
const Quotation = require("../models/Quotation");

const getDashboardStats = async (req, res) => {
  try {
    const privileged = ["Admin", "Manager"].includes(req.user.role);
    const leadQuery = privileged ? {} : { assignedTo: req.user._id };
    const now = new Date();
    const startToday = new Date(now); startToday.setHours(0,0,0,0);
    const endToday = new Date(startToday); endToday.setDate(endToday.getDate()+1);
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);
    const [totalLeads,totalCustomers,totalInstallations,pendingServices,completedServices,totalProducts,lowStockProducts,todayLeads,todayCustomers,followUpsToday,overdueFollowUps,wonDeals,monthlyQuotes] = await Promise.all([
      Lead.countDocuments(leadQuery), Customer.countDocuments(), Installation.countDocuments(), Service.countDocuments({status:"Pending"}), Service.countDocuments({status:"Completed"}), Product.countDocuments(), Product.find({quantity:{$lte:5}}).sort({quantity:1}).limit(5).lean(), Lead.countDocuments({...leadQuery,createdAt:{$gte:startToday}}), Customer.countDocuments({createdAt:{$gte:startToday}}), Lead.countDocuments({...leadQuery,$or:[{nextFollowUpDate:{$gte:startToday,$lt:endToday}},{followUpDate:{$gte:startToday,$lt:endToday}}],followUpStatus:{$ne:"Completed"}}), Lead.countDocuments({...leadQuery,$or:[{nextFollowUpDate:{$lt:startToday}},{followUpDate:{$lt:startToday}}],followUpStatus:{$ne:"Completed"}}), Lead.countDocuments({...leadQuery,status:"Won"}), Quotation.find({createdAt:{$gte:startMonth,$lt:endMonth},status:{$in:["Approved","Converted"]}}).select("grandTotal").lean()
    ]);
    const monthlyRevenue = monthlyQuotes.reduce((s,q)=>s+Number(q.grandTotal||0),0);
    const pipeline = await Lead.aggregate([{ $match: leadQuery }, { $group: { _id:"$status", count:{$sum:1}, value:{$sum:{$ifNull:["$budget",0]}} } }]);
    const recentLeads = await Lead.find(leadQuery).populate("assignedTo","name role").sort({createdAt:-1}).limit(5).lean();
    const recentCustomers = await Customer.find().sort({createdAt:-1}).limit(5).lean();
    const recentInstallations = await Installation.find().sort({createdAt:-1}).limit(5).lean();
    const recentServices = await Service.find().sort({createdAt:-1}).limit(5).lean();
    res.json({success:true,data:{totalLeads,totalCustomers,totalInstallations,pendingServices,completedServices,totalProducts,todayLeads,todayCustomers,followUpsToday,overdueFollowUps,wonDeals,monthlyRevenue,pipeline,recentLeads,recentCustomers,recentInstallations,recentServices,lowStockProducts}});
  } catch(error){ res.status(500).json({success:false,message:error.message}); }
};
module.exports={getDashboardStats};
