const router = require('express').Router()
const admin = require('firebase-admin')
router.get("/", (req, res) => {
    return res.send("inside the user router")
});

router.get("/jwtverfication", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ msd: "Token Not Found" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodedValue = await admin.auth().verifyIdToken(token);
        if (!decodedValue) {
            return res.status(500).json({ success: false, msg: "unauthorized access" });
        }
        return res.status(200).json({ success: true, data: decodedValue });
    } catch (err) {
        return res.send({
            success: false,
            msg: `Erroe in extracting the token : ${err}`,
        });
    }
})


module.exports = router;