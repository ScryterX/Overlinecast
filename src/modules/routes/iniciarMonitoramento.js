// Importando os módulos necessários
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

// Função principal que configura e inicia a monitoração e retransmissão
function iniciarMonitoramento(
  mediaDirectory,
  ffmpegPath,
  destinationUrl,
  streamKey
) {
  // Monitorar a pasta de mídia para novos arquivos
  fs.watch(mediaDirectory, { encoding: "buffer" }, (eventType, filename) => {
    if (filename && eventType === "rename") {
      console.log(`Stream detected: ${filename}`);

      // Comando FFmpeg para retransmitir
      const ffmpeg = spawn(ffmpegPath, [
        "-re",
        "-i",
        path.join(mediaDirectory, filename.toString()),
        "-c",
        "copy",
        "-f",
        "flv",
        `${destinationUrl}/${streamKey}`,
      ]);

      ffmpeg.stdout.on("data", (data) => {
        console.log(`FFmpeg Output: ${data}`);
      });

      ffmpeg.stderr.on("data", (data) => {
        console.error(`FFmpeg Error: ${data}`);
      });

      ffmpeg.on("close", (code) => {
        console.log(`FFmpeg exited with code ${code}`);
      });
    }
  });

  console.log("Monitoring for new streams...");
}

// Exportando a função
module.exports = iniciarMonitoramento;
