// DOM elements
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

// Variables for media stream and peer connection
let localStream;
let peerConnection;

// Configuration for ICE servers (you should use proper STUN/TURN servers)
const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    // Add TURN server configuration if needed
];

// Constraints for getUserMedia
const mediaConstraints = {
    video: true,
    audio: true,
};

// Event listeners for buttons
startButton.addEventListener('click', startVideoChat);
stopButton.addEventListener('click', stopVideoChat);

// Function to start the video chat
async function startVideoChat() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        localVideo.srcObject = localStream;

        // Create a peer connection
        peerConnection = new RTCPeerConnection({ iceServers });

        // Add the local stream to the peer connection
        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        // Handle incoming media streams from the remote peer
        peerConnection.ontrack = (event) => {
            if (!remoteVideo.srcObject) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        // Negotiate SDP and ICE candidates with the remote peer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer to the remote peer (you should implement signaling)
        // Example: sendOfferToRemotePeer(offer);

    } catch (error) {
        console.error('Error starting video chat:', error);
    }
}

// Function to stop the video chat
function stopVideoChat() {
    if (localStream) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    if (peerConnection) {
        peerConnection.close();
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}
