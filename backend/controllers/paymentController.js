import razorpayInstance from "../config/razorpay.js";
import { Payment } from "../models/paymentModel.js";
import crypto from 'crypto'
import { User } from "../models/userModel.js";
import { PLANS } from "../config/plan.js";

export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body;

        const plan = PLANS[planId];

        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan."
            });
        }

        const amount = plan.amount;
        const credits = plan.credits;
        if (!amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" })
        }

        // Step 1: Create Razorpay order
        const options = {
            amount: Math.round(Number(amount) * 100), // convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        await Payment.create({
            userId: req.user._id,
            planId,
            amount,
            credits,
            razorpayOrderId:razorpayOrder.id,
            status:"pending"
        })
        return res.status(200).json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    // const userId = req.user._id;

    // ✅ Handle successful payment
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
       return res.status(400).json({success:false, message:"Invalid Payment Signature"})
    }

    const payment = await Payment.findOne({
        razorpayOrderId:razorpay_order_id
    })

    if(!payment){
        return res.status(400).json({success:false, message:"Payment not found"})
    }
    if(payment.status === "paid"){
        return res.json({success:false, message:"Already processed"})
    }

    //update payment record
    payment.status = "paid"
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save()

    //update user credits
    const updateUser = await User.findByIdAndUpdate(
    payment.userId,
    {
        $inc: { credits: payment.credits },
        plan: payment.planId
    },
    { new: true }
)
    return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
        user: {
            id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            avatar: updateUser.avatar,
            credits: updateUser.credits,
            plan: updateUser.plan
        }
    });
  } catch (error) {
    console.error("❌ Error in verifyPayment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};