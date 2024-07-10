const cors = require('cors');

app.use(cors({
    origin: ["http://localhost:3000", "https://chat-ok.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true
}));
