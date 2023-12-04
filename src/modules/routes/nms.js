// relay: {
//   ffmpeg: "C:\\ffmpeg\\bin\\ffmpeg.exe",
//   tasks: [
//     {
//       app: "live",
//       mode: "push",
//       edge: "rtmp://localhost/app2", // Retransmite para uma nova aplicação no mesmo servidor
//       name: "STREAMID", // Nome do stream original
//       vc: "copy", // Usa os mesmos codecs de vídeo
//       ac: "copy", // Usa os mesmos codecs de áudio
//       fmt: "flv",
//     },
//   ],
// },
const NodeMediaServer = require("node-media-server");
const { spawn } = require("child_process");

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8000,
    mediaroot: "./media",
    allow_origin: "*",
  },
  trans: {
    ffmpeg: "C:\\ffmpeg\\bin\\ffmpeg.exe",
    tasks: [
      {
        app: "live",
        hls: true,
        hlsFlags: "[hls_time=2:hls_list_size=4:hls_flags=delete_segments]",
        dash: true,
        dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

nms.on("postPublish", (id, StreamPath, args) => {
  const streamKey = StreamPath.split("/").pop();
  console.log(`Iniciando a retransmissão para a chave de stream: ${streamKey}`);

  const processTwitch = spawn("C:\\ffmpeg\\bin\\ffmpeg.exe", [
    "-re",
    "-i",
    `rtmp://localhost/live/${streamKey}`, // Entrada
    "-c:v",
    "libx264", // Codec de vídeo
    "-b:v",
    "6000k", // Bitrate de vídeo (ajuste conforme necessário)
    "-preset",
    "veryfast",
    "-profile:v",
    "main",
    "-g",
    "60", // Keyframe interval
    "-bufsize",
    "16500k",
    "-c:a",
    "aac", // Codec de áudio
    "-f",
    "flv", // Especificar o formato de saída como FLV
    "rtmp://sao03.contribute.live-video.net/app/live_524245497_CgRltRBhHAN92D2s6vS56rkfeg3XIC", // URL de destino completa, incluindo a chave de stream
  ]);

  const processYouTube = spawn("C:\\ffmpeg\\bin\\ffmpeg.exe", [
    "-re",
    "-i",
    `rtmp://localhost/live/${streamKey}`, // Entrada
    "-c:v",
    "libx264", // Codec de vídeo
    "-b:v",
    "16500k", // Bitrate de vídeo (ajuste conforme necessário)
    "-preset",
    "veryfast",
    "-profile:v",
    "main",
    "-g",
    "60", // Keyframe interval
    "-bufsize",
    "6500k",
    "-c:a",
    "aac", // Codec de áudio
    "-f",
    "flv", // Especificar o formato de saída como FLV
    "rtmp://a.rtmp.youtube.com/live2/shy0-a6tw-u6qq-pck8-8g0x", // URL de destino completa, incluindo a chave de stream
  ]);
  // Manipuladores de eventos para o processo da Twitch
  processTwitch.stderr.on("data", (data) => {
    console.error(`stderr Twitch: ${data}`);
  });

  processTwitch.on("close", (code) => {
    console.log(`Processo FFmpeg da Twitch encerrado com código ${code}`);
  });

  // Manipuladores de eventos para o processo do YouTube
  processYouTube.stderr.on("data", (data) => {
    console.error(`stderr YouTube: ${data}`);
  });

  processYouTube.on("close", (code) => {
    console.log(`Processo FFmpeg do YouTube encerrado com código ${code}`);
  });
});

module.exports = nms;
