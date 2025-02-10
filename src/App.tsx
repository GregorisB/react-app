import { Copy, Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import Peer from "peerjs";
import { useEffect, useState } from "react";
import { VideoEffects } from "./components/VideoEffects";
import { VideoStream } from "./components/VideoStream";
import { effectThatDisableCamera } from "./constants";
import { FilterEnum, PeerConnection, VideoEffect } from "./types";

function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string>("");
  const [connections, setConnections] = useState<PeerConnection[]>([]);
  const [targetPeerId, setTargetPeerId] = useState<string>("");
  const [localEffect, setLocalEffect] = useState<VideoEffect>(FilterEnum.None);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    const initPeer = new Peer();
    setPeer(initPeer);

    initPeer.on("open", (id) => {
      setPeerId(id);
    });

    initPeer.on("call", (call) => {
      if (localStream) {
        call.answer(localStream);
        call.on("stream", (remoteStream) => {
          setConnections((prev) => [
            ...prev.filter((conn) => conn.peerId !== call.peer),
            {
              peerId: call.peer,
              stream: remoteStream,
              effect: FilterEnum.None,
            },
          ]);
        });
      }
    });

    return () => {
      initPeer.destroy();
    };
  }, [localStream]);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (err) {
        console.error("Failed to get media devices:", err);
      }
    };

    initCamera();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCall = () => {
    if (!peer || !localStream || !targetPeerId) return;

    const call = peer.call(targetPeerId, localStream);
    call.on("stream", (remoteStream) => {
      setConnections((prev) => [
        ...prev.filter((conn) => conn.peerId !== targetPeerId),
        { peerId: targetPeerId, stream: remoteStream, effect: FilterEnum.None },
      ]);
    });
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(!isMicOn);
    }
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId);
  };

  const getGridColumns = () => {
    const totalParticipants = connections.length + 1;
    if (totalParticipants <= 1) return "grid-cols-1";
    if (totalParticipants === 2) return "grid-cols-2";
    if (totalParticipants <= 4) return "grid-cols-2";
    if (totalParticipants <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };
  useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const shouldDisableCamera = effectThatDisableCamera.includes(localEffect);

      videoTrack.enabled = !shouldDisableCamera;
      setIsCameraOn(videoTrack.enabled);
    }
  }, [localEffect, localStream]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Video Chat</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <span className="text-sm text-gray-500">Your ID:</span>
              <span className="font-mono">{peerId}</span>
              <button
                onClick={copyPeerId}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_250px] gap-8">
          <div className="space-y-8">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className={`grid ${getGridColumns()} gap-4 mb-4`}>
                {localStream && (
                  <div className="relative">
                    <VideoStream
                      stream={localStream}
                      effect={localEffect}
                      muted
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      You
                    </div>
                  </div>
                )}
                {connections.map((connection) => (
                  <div key={connection.peerId} className="relative">
                    <VideoStream
                      stream={connection.stream}
                      effect={connection.effect}
                    />
                    <div className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Peer: {connection.peerId.slice(0, 6)}...
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full ${
                    isCameraOn
                      ? "bg-blue-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isCameraOn ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <VideoOff className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-full ${
                    isMicOn ? "bg-blue-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {isMicOn ? (
                    <Mic className="w-6 h-6" />
                  ) : (
                    <MicOff className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Start a Call</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={targetPeerId}
                  onChange={(e) => setTargetPeerId(e.target.value)}
                  placeholder="Enter peer ID"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleCall}
                  disabled={!targetPeerId}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </button>
              </div>
            </div>
          </div>

          <VideoEffects
            currentEffect={localEffect}
            onEffectChange={setLocalEffect}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
