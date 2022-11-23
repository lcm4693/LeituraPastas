const fs = require("fs").promises;

const pastaRaizResultado = 'termos';
const dataInicio = new Date();
let proximoMinutoMostrar = 0;

let conteudoFinal = "";

async function listarArquivosDoDiretorio(diretorio, arquivos) {
  if (!arquivos) arquivos = [];
  let listaDeArquivos;
  try {
    listaDeArquivos = await fs.readdir(diretorio);
  } catch (e) {
    const escrita = "Diretório com prob: " + diretorio;
    conteudoFinal += "\n" + escrita;
    console.log(escrita);
  }

  for (let k in listaDeArquivos) {
    try {
      let stat = await fs.stat(diretorio + "/" + listaDeArquivos[k]);

      const segundosInicioMenosAtual = (new Date() - dataInicio) / 1000;
      const minuto = Math.round(segundosInicioMenosAtual / 60);
      if (minuto > proximoMinutoMostrar) {
        proximoMinutoMostrar++;
        const escrita = "Tempo Decorrido: " + segundosInicioMenosAtual + "(s)";
        conteudoFinal += "\n" + escrita;
        console.log(escrita);
        // console.log("Local: " + diretorio + "/" + listaDeArquivos[k]);
      }
      if (stat.isDirectory() && diretorioPermitido(listaDeArquivos[k])) {
        if (
          listaDeArquivos[k]
            .toUpperCase()
            .includes(termoParaBuscar.toUpperCase())
        ) {
          // if (listaDeArquivos[k].toUpperCase() === termoParaBuscar.toUpperCase()) {
          const escrita = "->" + diretorio + "/" + listaDeArquivos[k];
          conteudoFinal += "\n" + escrita;
          console.log(escrita);
          continue;
        }
        await listarArquivosDoDiretorio(
          diretorio + "/" + listaDeArquivos[k],
          arquivos
        );
      } else {
        if (
          listaDeArquivos[k]
            .toUpperCase()
            .includes(termoParaBuscar.toUpperCase())
        ) {
          // if (listaDeArquivos[k].toUpperCase() === (termoParaBuscar.toUpperCase() + '.' +buscarExtensaoArquivo(listaDeArquivos[k]))) {
          const escrita = "->" + diretorio + "/" + listaDeArquivos[k];
          conteudoFinal += "\n" + escrita;
          console.log(escrita);
          continue;
        }
      }
    } catch (e) {
      if (!e.message.startsWith("EPERM") && !e.message.startsWith("ENOENT")) {
        const escrita = "*** " + e.message;
        conteudoFinal += "\n" + escrita;
        console.log(escrita);
      }
    }
  }

  return arquivos;
}

function buscarExtensaoArquivo(arquivo) {
  const array = arquivo.split(".");
  return array[array.length - 1].toUpperCase();
}

function diretorioPermitido(diretorio) {
  if (
    !diretorio.startsWith("$") &&
    diretorio.toUpperCase() !== "JBOSS6" &&
    diretorio.toUpperCase() !== "ECLIPSE" &&
    diretorio.toUpperCase() !== "TARGET" &&
    diretorio.toUpperCase() !== "NODE_MODULES" && 
    diretorio.toUpperCase() !== "ARQUIVOS DE PROGRAMAS" &&
    diretorio.toUpperCase() !== "PROGRAM FILES"
  ) {
    return true;
  } else {
    return false;
  }
}

const termoParaBuscar = process.argv[2];
const pastaInicial = process.argv[3];

async function test() {
  if (!termoParaBuscar) {
    console.log(
      "NENHUM PARÂMETRO ENVIADO PARA SER BUSCADO. TENTE node teste.js 'PARAM'"
    );
  } else {

    try{
      await fs.access(pastaRaizResultado);
    }catch(e){
      fs.mkdir(pastaRaizResultado);
    }

    conteudoFinal += "Buscando pelo termo: " + termoParaBuscar;
    console.log("Buscando pelo termo: " + termoParaBuscar);
    conteudoFinal += "\n" + "Início: " + dataInicio;
    console.log("Início: " + dataInicio);
    const pasta = pastaInicial;
    if (!pastaInicial) {
      console.log("VOCÊ DEVE DEFINIR UM CAMINHO INICIAL. EX: c:");
      return;
    }
    await listarArquivosDoDiretorio(pasta); // coloque o caminho do seu diretorio
    conteudoFinal += "\n" + "Final: " + new Date();
    console.log("Final: " + new Date());

    const pastaDia = pastaRaizResultado + '/' + montarAnoMesDia();

    try{
      await fs.access(pastaDia);
    }catch(e){
      fs.mkdir(pastaDia);
    }
    fs.writeFile(pastaDia + '/' + montarNomeArquivo(termoParaBuscar), conteudoFinal);
  }
}

function montarAnoMesDia() {
  const dia =
    dataInicio.getFullYear() +
    "-" +
    (dataInicio.getMonth() + 1) +
    "-" +
    dataInicio.getDate();
  return dia;
}

function montarNomeArquivo(termoParaBuscar) {
  const nome =
    montarAnoMesDia() +
    "_" +
    dataInicio.getHours() +
    "_" +
    dataInicio.getMinutes();

  const nomeFinal = termoParaBuscar.replace(" ", "_") + "__" + nome + ".txt";

  return nomeFinal;
}

test();
