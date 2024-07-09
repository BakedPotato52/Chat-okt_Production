const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const io = require("socket.io")(server, { /* Socket.io configuration */ })