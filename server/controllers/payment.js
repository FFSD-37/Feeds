import Payment from "../models/payment.js";
import User from "../models/users_schema.js"
import { instance } from "../services/razorpay.js"

const checkOut = async (req, res) => {
    try {
        const { data } = req.userDetails;
        const { plan_name, plan_price } = req.body;
        const username = data[0];
        let order;
        let amount = Number(plan_price) * 100;

        order = await instance.orders.create({
            amount
        })

        await Payment.create({
            id: `${username}-${Date.now()}`,
            username,
            type: req.body.plan_name,
            amount: amount/100,
            status: 'Pending',
            reference_id: order.id
        })

        return res.status(200).json({ order });
    }
    catch (error) {

        console.log(error);

    }
}

const verify_payment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        await Payment.findOneAndUpdate(
            { reference_id: razorpay_order_id },
            { status: "Completed" },
            { new: true }
        );

        const { data } = req.userDetails;
        

        await User.findOneAndUpdate(
            { username: data[0]},
            { isPremium: true, coins: 0 },
            { new: true }
        )
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}

export { checkOut, verify_payment }