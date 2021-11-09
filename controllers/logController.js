const Express = require("express");
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt");
const { Log, User } = require("../models");



/*
==========================
    Crate a Log
==========================
*/
router.post("/log", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id: id
    }
    try {
        const newLog = await Log.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    Log.create(logEntry)
});
router.get("/log", (req, res) => {
    res.send("This is the about route!")
});

/*
// ==========================
//    Get all Logs
// ==========================
// */
// router.get("/", async (req, res) => {
//     try {
//         const entries = await Log.findAll();
//         res.status(200).json(entries);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// });

/*
==========================
   Get all Logs by user
==========================
*/
router.get("/", validateJWT, async (req, res) => {
    const {id} = req.user;
    try {
        const entries = await Log.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({error: err})
    }
});

/*
===============================
   Get all Logs by user id
===============================
*/
router.get("/:id", validateJWT, async (req, res) => {
    const logId = req.params.id;
    const {id} = req.user;
    try {
        const userLogs = await Log.findAll({
            where: {
            //    id: logId,
               owner_id: req.user.id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({error:err});
    }
});

/*
===============================
   Update a log by a user
===============================
*/

router.put("/update/:entryId", validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: logId,
            owner_id: userId
        }
    };
    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    };
    try {
        const update = await Log.update(updatedLog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
===============================
   Delete a log by a user
===============================
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id:logId,
                owner_id: ownerId
            }
        };
        await Log.destroy(query);
        res.status(200).json({ message: "Log Entry Removed" });
    } catch (err) {
        res.status(500).json({ error:err });
    }
});

module.exports = router;