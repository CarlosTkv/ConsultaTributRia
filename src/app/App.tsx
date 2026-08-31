import { useState } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, ChevronRight, RotateCcw, Info, FileSearch, MapPin } from "lucide-react";

const UF_LIST = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const REGIMES_PRODUTO = [
  { value: "simples", label: "Simples Nacional" },
  { value: "mei", label: "MEI" },
  { value: "presumido", label: "Lucro Presumido" },
  { value: "real", label: "Lucro Real" },
  { value: "imune", label: "Imune / Isento" },
];

const REGIMES_PRESTADOR = [
  { value: "simples", label: "Simples Nacional" },
  { value: "mei", label: "MEI" },
  { value: "presumido", label: "Lucro Presumido" },
  { value: "real", label: "Lucro Real" },
  { value: "autonomo", label: "Autônomo / Profissional Liberal" },
  { value: "imune", label: "Imune / Isento" },
];

const REGIMES_TOMADOR = [
  { value: "pf", label: "Pessoa Física" },
  { value: "simples", label: "Simples Nacional" },
  { value: "mei", label: "MEI" },
  { value: "presumido", label: "Lucro Presumido" },
  { value: "real", label: "Lucro Real" },
  { value: "publico", label: "Órgão Público" },
  { value: "imune", label: "Imune / Isento" },
];

// NCMs por capítulo sujeitos a ST por UF destino
const NCM_ST_CAPITULOS: Record<string, { descricao: string; ufs: string[] }> = {
  "22": { descricao: "Bebidas", ufs: ["SP","RJ","MG","RS","SC","PR","BA","PE","GO","MT","MS","CE","DF","ES","AM","PA"] },
  "24": { descricao: "Cigarros e derivados do tabaco", ufs: UF_LIST },
  "27": { descricao: "Combustíveis e lubrificantes", ufs: UF_LIST },
  "30": { descricao: "Produtos farmacêuticos", ufs: ["SP","RJ","MG","RS","SC","PR","BA","PE","GO","MT","MS","DF","CE","ES","AM","PA","RN","PB","AL","SE","MA","PI","AC","RO","TO","AP","RR"] },
  "33": { descricao: "Perfumes e cosméticos", ufs: ["SP","RJ","MG","RS","SC","PR","BA","PE","GO","DF","CE","ES","MT","MS"] },
  "34": { descricao: "Sabões, detergentes e produtos de limpeza", ufs: ["SP","RJ","MG","RS","SC","PR","BA","GO","CE","DF"] },
  "38": { descricao: "Produtos químicos", ufs: ["SP","RJ","MG","RS","SC","PR","BA","GO","DF","MT","MS"] },
  "39": { descricao: "Plásticos e suas obras", ufs: ["SP","RJ","MG","RS","SC","PR","GO","DF"] },
  "40": { descricao: "Borrachas e suas obras", ufs: ["SP","RJ","MG","RS","SC","PR","BA","GO","DF"] },
  "84": { descricao: "Máquinas e equipamentos", ufs: ["SP","RJ","MG","RS","SC","PR","GO","DF","MT","MS"] },
  "85": { descricao: "Eletroeletrônicos", ufs: ["SP","RJ","MG","RS","SC","PR","BA","PE","GO","DF","CE","MT","MS","AM"] },
  "87": { descricao: "Veículos automotores", ufs: UF_LIST },
};

// Serviços sujeitos à retenção pelo tomador (LC 116/2003, Art. 6º)
const SERVICOS_RETENCAO = [
  "01.01","01.02","01.03","01.04","01.05","01.06","01.07",
  "02.01","02.02",
  "04.01","04.02","04.03","04.04","04.05","04.06","04.07","04.08","04.09","04.10","04.11","04.12","04.13","04.14","04.15","04.16","04.17","04.18","04.19","04.20","04.21","04.22","04.23",
  "05.01","05.02","05.03","05.04","05.05","05.06","05.07","05.08","05.09",
  "06.01","06.02","06.03","06.04","06.05",
  "07.02","07.04","07.05","07.09","07.10","07.12","07.14","07.15","07.16","07.17","07.19",
  "08.01","08.02",
  "10.01","10.02","10.03","10.04","10.05","10.06","10.07","10.08","10.09","10.10",
  "11.01","11.02","11.03","11.04",
  "12.01","12.02","12.03","12.04","12.05","12.06","12.07","12.08","12.09","12.10","12.11","12.12","12.13",
  "13.01","13.02","13.03","13.04","13.05",
  "14.01","14.02","14.03","14.04","14.05",
  "17.01","17.02","17.03","17.04","17.05","17.06","17.07","17.08","17.09","17.10",
  "20.01","20.02","20.03",
  "21.01","26.01",
];

// Serviços cujo ISS é devido no LOCAL DE PRESTAÇÃO, não no estabelecimento do prestador (Art. 3º, exceções LC 116/2003)
const SERVICOS_ISS_LOCAL_PRESTACAO: { prefixo: string; descricao: string }[] = [
  { prefixo: "3.04", descricao: "Locação de bens imóveis" },
  { prefixo: "3.05", descricao: "Cessão de andaimes, palcos, coberturas" },
  { prefixo: "7.02", descricao: "Execução de obras de construção civil por empreitada" },
  { prefixo: "7.04", descricao: "Demolição" },
  { prefixo: "7.05", descricao: "Reparação, conservação e reforma de edifícios" },
  { prefixo: "7.09", descricao: "Varrição, coleta, remoção, incineração de resíduos" },
  { prefixo: "7.10", descricao: "Limpeza, manutenção e conservação de vias e logradouros" },
  { prefixo: "7.12", descricao: "Controle e tratamento de efluentes" },
  { prefixo: "7.14", descricao: "Florestamento, reflorestamento, semeadura" },
  { prefixo: "7.15", descricao: "Escoamento pluvial, saneamento ambiental" },
  { prefixo: "7.16", descricao: "Limpeza e dragagem de rios, portos, canais" },
  { prefixo: "7.17", descricao: "Acompanhamento e fiscalização da execução de obras" },
  { prefixo: "7.19", descricao: "Aplicação de inseticidas, fungicidas, herbicidas" },
  { prefixo: "11.01", descricao: "Guarda e estacionamento de veículos" },
  { prefixo: "11.02", descricao: "Vigilância, segurança e monitoramento de bens e pessoas" },
  { prefixo: "11.04", descricao: "Armazenamento, depósito e guarda de bens" },
  { prefixo: "12.01", descricao: "Espetáculos teatrais" },
  { prefixo: "12.02", descricao: "Exibições cinematográficas" },
  { prefixo: "12.03", descricao: "Espetáculos circenses" },
  { prefixo: "12.04", descricao: "Programas de auditório" },
  { prefixo: "12.05", descricao: "Parques de diversões, centros de lazer" },
  { prefixo: "12.06", descricao: "Boates, taxi-dancing" },
  { prefixo: "12.07", descricao: "Shows, ballet, danças, desfiles, bailes" },
  { prefixo: "12.08", descricao: "Feiras, exposições, congressos" },
  { prefixo: "12.09", descricao: "Bilhares, boliche e diversões eletrônicas" },
  { prefixo: "12.10", descricao: "Corridas e competições de animais" },
  { prefixo: "12.11", descricao: "Competições esportivas ou de destreza física" },
  { prefixo: "12.12", descricao: "Execução de música" },
  { prefixo: "12.13", descricao: "Produção de eventos, desfiles, feiras, exposições" },
  { prefixo: "16.01", descricao: "Serviços de transporte de natureza municipal" },
  { prefixo: "17.10", descricao: "Chaveiros, confecção de carimbos, serviços gráficos" },
  { prefixo: "20.01", descricao: "Serviços portuários, aeroportuários" },
  { prefixo: "20.02", descricao: "Serviços de navegação de cabotagem" },
  { prefixo: "20.03", descricao: "Serviços de navegação interior" },
];

const SOUTH_SOUTHEAST = ["SP","RJ","MG","ES","RS","SC","PR"];

function getAliquotaInterestadual(origem: string, destino: string): number {
  if (SOUTH_SOUTHEAST.includes(origem) && !SOUTH_SOUTHEAST.includes(destino)) return 7;
  return 12;
}

function getAliquotaInterna(uf: string): number {
  const altas = ["SP","RJ","MG","BA","PI","MA","CE","RN","AL","SE","PB","PE"];
  if (altas.includes(uf)) return 18;
  const medias = ["RS","SC","PR","ES","GO","MT","MS","DF","AM","PA","RO","TO","AC","AP","RR"];
  if (medias.includes(uf)) return 17;
  return 12;
}

type Status = "sim" | "nao" | "verificar";

interface TaxInfo {
  status: Status;
  motivo: string;
  detalhes?: { label: string; valor: string }[];
  fundamentacao?: string;
}

interface Resultado {
  st: TaxInfo;
  difal: TaxInfo;
  iss: TaxInfo;
}

type LocalTipo = "prestador" | "tomador" | "outro";

interface FormState {
  tipoItem: "produto" | "servico";
  codigo: string;
  // Produto
  regimeOrigem: string;
  regimeDestino: string;
  ufOrigem: string;
  ufDestino: string;
  // Serviço
  regimePrestador: string;
  regimeTomador: string;
  ufPrestador: string;
  cidadePrestador: string;
  ufTomador: string;
  cidadeTomador: string;
  localTipo: LocalTipo;
  ufLocal: string;
  cidadeLocal: string;
}

function normalizar(s: string) {
  return s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function getMunicipio(cidade: string, uf: string) {
  const c = cidade.trim() || "—";
  return `${c}/${uf}`;
}

function mesmoMunicipio(c1: string, uf1: string, c2: string, uf2: string) {
  if (!c1.trim() || !c2.trim()) return false;
  return uf1 === uf2 && normalizar(c1) === normalizar(c2);
}

function getLocalEfetivo(form: FormState): { cidade: string; uf: string; label: string } {
  if (form.localTipo === "prestador") return { cidade: form.cidadePrestador, uf: form.ufPrestador, label: "Mesmo do prestador" };
  if (form.localTipo === "tomador") return { cidade: form.cidadeTomador, uf: form.ufTomador, label: "Mesmo do tomador" };
  return { cidade: form.cidadeLocal, uf: form.ufLocal, label: "Outro local" };
}

function calcularST(form: FormState): TaxInfo {
  if (form.tipoItem === "servico") {
    return {
      status: "nao",
      motivo: "A Substituição Tributária é um regime de arrecadação do ICMS e não se aplica a prestações de serviços tributadas pelo ISS.",
      fundamentacao: "Art. 150, §7º, CF/1988; Art. 6º, LC 87/1996",
    };
  }
  const cap = form.codigo.replace(/\D/g, "").substring(0, 2);
  const capInfo = NCM_ST_CAPITULOS[cap];
  if (!capInfo) {
    return {
      status: "verificar",
      motivo: `O NCM ${form.codigo} não foi localizado nos capítulos de maior incidência de ST. Verifique os Convênios e Protocolos ICMS para o par ${form.ufOrigem}–${form.ufDestino} e a CEST correspondente ao produto.`,
      fundamentacao: "Tabela CEST (Convênio ICMS 92/2015); CONFAZ",
    };
  }
  if (capInfo.ufs.includes(form.ufDestino)) {
    const aliqInterna = getAliquotaInterna(form.ufDestino);
    return {
      status: "sim",
      motivo: `O NCM ${form.codigo} pertence ao capítulo ${cap} (${capInfo.descricao}) e está sujeito à Substituição Tributária para operações destinadas a ${form.ufDestino}, conforme Convênios e Protocolos ICMS vigentes.`,
      detalhes: [
        { label: "Capítulo NCM", valor: `${cap} — ${capInfo.descricao}` },
        { label: "Alíquota interna destino", valor: `${aliqInterna}% (${form.ufDestino})` },
        { label: "Base de cálculo", valor: "Valor da operação + frete + IPI × (1 + MVA ou Pauta Fiscal)" },
        { label: "Responsável", valor: "Substituto tributário — remetente / fabricante / importador" },
      ],
      fundamentacao: `Convênio/Protocolo ICMS — ${form.ufOrigem}/${form.ufDestino}; Art. 6º, LC 87/1996`,
    };
  }
  return {
    status: "nao",
    motivo: `Não há Protocolo ou Convênio ICMS determinando a aplicação da ST para o NCM ${form.codigo} (${capInfo.descricao}) em operações destinadas a ${form.ufDestino}. Aplica-se o regime normal de tributação.`,
    fundamentacao: "Ausência de Convênio/Protocolo ICMS bilateral — CONFAZ",
  };
}

function calcularDIFAL(form: FormState): TaxInfo {
  if (form.tipoItem === "servico") {
    return {
      status: "nao",
      motivo: "O DIFAL (EC 87/2015 / LC 190/2022) aplica-se exclusivamente a operações com circulação de mercadorias sujeitas ao ICMS. Serviços tributados pelo ISS não estão sujeitos a este diferencial.",
      fundamentacao: "EC 87/2015; LC 190/2022; ADI 7066/STF (2023)",
    };
  }
  const { ufOrigem, ufDestino, regimeOrigem, regimeDestino } = form;
  if (ufOrigem === ufDestino) {
    return {
      status: "nao",
      motivo: `Operação interna (${ufOrigem} → ${ufDestino}). O DIFAL incide apenas em operações interestaduais.`,
      fundamentacao: "Art. 155, §2º, VII, CF/1988; LC 190/2022",
    };
  }
  if (["simples", "mei"].includes(regimeOrigem)) {
    return {
      status: "nao",
      motivo: `Empresas optantes pelo ${regimeOrigem === "mei" ? "MEI" : "Simples Nacional"} estão dispensadas do recolhimento do DIFAL, conforme entendimento firmado pelo STF no julgamento da ADI 7066 (2023), que declarou inconstitucional a exigência sem previsão específica na LC 190/2022 para optantes do Simples.`,
      fundamentacao: "ADI 7066/STF (2023); LC 123/2006; LC 190/2022",
    };
  }
  if (regimeDestino === "imune") {
    return {
      status: "nao",
      motivo: "Destinatário imune ou isento não gera obrigação de DIFAL para o remetente, pois a imunidade/isenção afasta a incidência do ICMS sobre a operação.",
      fundamentacao: "Art. 150, VI, CF/1988; Consultas SEFAZ",
    };
  }
  const aliqInter = getAliquotaInterestadual(ufOrigem, ufDestino);
  const aliqInterna = getAliquotaInterna(ufDestino);
  const dif = aliqInterna - aliqInter;
  if (dif > 0) {
    return {
      status: "sim",
      motivo: `Operação interestadual ${ufOrigem} → ${ufDestino} sujeita ao DIFAL. A alíquota interna do destino (${aliqInterna}%) supera a alíquota interestadual (${aliqInter}%), gerando diferencial de ${dif} pontos percentuais a recolher ao estado de ${ufDestino}.`,
      detalhes: [
        { label: "Alíquota interestadual", valor: `${aliqInter}%` },
        { label: "Alíquota interna destino", valor: `${aliqInterna}% (${ufDestino})` },
        { label: "DIFAL a recolher", valor: `${dif}% sobre a base de cálculo` },
        { label: "Destinatário", valor: `Estado de ${ufDestino}` },
      ],
      fundamentacao: "EC 87/2015; LC 190/2022; RICMS do estado de destino",
    };
  }
  return {
    status: "verificar",
    motivo: `Alíquota interestadual estimada igual ou superior à interna do destino. Confirme as alíquotas exatas na legislação de ${ufDestino} para verificar se há DIFAL a recolher.`,
    fundamentacao: "EC 87/2015; LC 190/2022; RICMS do estado de destino",
  };
}

function calcularISS(form: FormState): TaxInfo {
  if (form.tipoItem === "produto") {
    return {
      status: "nao",
      motivo: "O ISS incide sobre prestações de serviços. Operações com mercadorias classificadas por NCM são tributadas pelo ICMS, não pelo ISS.",
      fundamentacao: "LC 116/2003; Art. 156, III, CF/1988",
    };
  }

  const codigo = form.codigo.trim();
  const localEfetivo = getLocalEfetivo(form);

  const ehRetencaoLC116 = SERVICOS_RETENCAO.some(s => codigo === s || codigo.startsWith(s));
  const excecaoArt3 = SERVICOS_ISS_LOCAL_PRESTACAO.find(s => codigo.startsWith(s.prefixo));

  // Município competente para arrecadação do ISS
  let munCompetente: { cidade: string; uf: string };
  let regra: string;

  if (excecaoArt3) {
    munCompetente = { cidade: localEfetivo.cidade, uf: localEfetivo.uf };
    regra = `Exceção do Art. 3º, LC 116/2003 — ISS devido no local de prestação (${excecaoArt3.descricao})`;
  } else {
    munCompetente = { cidade: form.cidadePrestador, uf: form.ufPrestador };
    regra = "Regra geral do Art. 3º, LC 116/2003 — ISS devido no estabelecimento do prestador";
  }

  const munPrestador = getMunicipio(form.cidadePrestador, form.ufPrestador);
  const munTomador = getMunicipio(form.cidadeTomador, form.ufTomador);
  const munLocal = getMunicipio(localEfetivo.cidade, localEfetivo.uf);
  const munCompLabel = getMunicipio(munCompetente.cidade, munCompetente.uf);

  const mesmoPrestadorTomador = mesmoMunicipio(form.cidadePrestador, form.ufPrestador, form.cidadeTomador, form.ufTomador);

  // Tomador PF: sem obrigação de reter (salvo lei municipal específica)
  if (form.regimeTomador === "pf") {
    return {
      status: "nao",
      motivo: `O tomador é Pessoa Física, que em geral não tem obrigação legal de efetuar a retenção do ISS. O imposto será recolhido pelo próprio prestador ao município de ${munCompLabel}.`,
      detalhes: [
        { label: "Município competente", valor: munCompLabel },
        { label: "Regra aplicada", valor: regra },
        { label: "Responsável pelo recolhimento", valor: "Prestador do serviço" },
        { label: "Alíquota", valor: "2% a 5% (conforme legislação municipal)" },
      ],
      fundamentacao: "Art. 6º, LC 116/2003; Legislação municipal do tomador",
    };
  }

  // Órgão Público: sempre retém (Art. 6º, §2º, II, LC 116/2003)
  if (form.regimeTomador === "publico") {
    return {
      status: "sim",
      motivo: `O tomador é Órgão Público, que é responsável pela retenção na fonte do ISS em todos os serviços que contratar, independentemente do código de serviço ou do município do prestador, conforme determinação expressa da LC 116/2003.`,
      detalhes: [
        { label: "Município do prestador", valor: munPrestador },
        { label: "Órgão público tomador", valor: munTomador },
        { label: "Local de prestação", valor: `${munLocal} (${localEfetivo.label})` },
        { label: "Município competente (ISS)", valor: munCompLabel },
        { label: "Responsável pelo recolhimento", valor: "Órgão Público tomador (retenção obrigatória)" },
        { label: "Alíquota", valor: "2% a 5% (conforme legislação do município competente)" },
      ],
      fundamentacao: "Art. 6º, §2º, II, LC 116/2003",
    };
  }

  // Municípios distintos + código sujeito a retenção
  if (!mesmoPrestadorTomador && ehRetencaoLC116) {
    const localDifere = !mesmoMunicipio(localEfetivo.cidade, localEfetivo.uf, form.cidadePrestador, form.ufPrestador);
    const detalheLocal = excecaoArt3
      ? `Para este serviço (${excecaoArt3.descricao}), o ISS é devido no local de prestação, conforme exceção do Art. 3º da LC 116/2003.`
      : `Prestador e tomador estão em municípios distintos — o tomador está obrigado a reter e recolher o ISS.`;

    return {
      status: "sim",
      motivo: `O código de serviço ${codigo} está sujeito à retenção na fonte pelo tomador (LC 116/2003, Art. 6º). ${detalheLocal}${localDifere && excecaoArt3 ? ` O local de prestação (${munLocal}) difere do estabelecimento do prestador (${munPrestador}).` : ""}`,
      detalhes: [
        { label: "Município do prestador", valor: munPrestador },
        { label: "Município do tomador", valor: munTomador },
        { label: "Local de prestação", valor: `${munLocal} (${localEfetivo.label})` },
        { label: "Município competente (ISS)", valor: munCompLabel },
        { label: "Regra de competência", valor: regra },
        { label: "Responsável pelo recolhimento", valor: "Tomador do serviço (retenção na fonte)" },
        { label: "Alíquota", valor: "2% a 5% (conforme legislação do município competente)" },
      ],
      fundamentacao: `Art. 3º e Art. 6º, LC 116/2003${excecaoArt3 ? `; ${excecaoArt3.descricao}` : ""}`,
    };
  }

  // Mesmo município ou código não sujeito a retenção
  if (mesmoPrestadorTomador) {
    return {
      status: "nao",
      motivo: `Prestador e tomador estão no mesmo município (${munPrestador}). O ISS é recolhido pelo próprio prestador — não há retenção na fonte.`,
      detalhes: [
        { label: "Município do prestador", valor: munPrestador },
        { label: "Município do tomador", valor: munTomador },
        { label: "Local de prestação", valor: `${munLocal} (${localEfetivo.label})` },
        { label: "Município competente (ISS)", valor: munCompLabel },
        { label: "Responsável pelo recolhimento", valor: "Prestador do serviço" },
        { label: "Alíquota", valor: "2% a 5% (conforme legislação municipal)" },
      ],
      fundamentacao: "Art. 3º, caput, LC 116/2003",
    };
  }

  // Municípios distintos mas código não sujeito a retenção obrigatória
  return {
    status: "verificar",
    motivo: `O código de serviço ${codigo} não consta na lista de retenção obrigatória da LC 116/2003. Contudo, prestador (${munPrestador}) e tomador (${munTomador}) estão em municípios distintos — verifique se a legislação municipal do tomador prevê retenção adicional.`,
    detalhes: [
      { label: "Município do prestador", valor: munPrestador },
      { label: "Município do tomador", valor: munTomador },
      { label: "Local de prestação", valor: `${munLocal} (${localEfetivo.label})` },
      { label: "Município competente (ISS)", valor: munCompLabel },
      { label: "Responsável pelo recolhimento", valor: "Prestador (sem retenção federal) — verificar lei municipal" },
    ],
    fundamentacao: "Art. 6º, LC 116/2003; Legislação municipal do tomador",
  };
}

function calcular(form: FormState): Resultado {
  return { st: calcularST(form), difal: calcularDIFAL(form), iss: calcularISS(form) };
}

// ─── UI Components ────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: Status }) {
  if (status === "sim") return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold tracking-wide uppercase bg-red-50 text-red-700 border border-red-200">
      <AlertTriangle className="w-3 h-3" />Aplicável
    </span>
  );
  if (status === "nao") return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" />Não Aplicável
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200">
      <Info className="w-3 h-3" />Verificar
    </span>
  );
}

function TaxCard({ index, titulo, subtitulo, sigla, info }: {
  index: number; titulo: string; subtitulo: string; sigla: string; info: TaxInfo;
}) {
  const cls: Record<Status, { border: string; header: string; sigla: string }> = {
    sim: { border: "border-red-200", header: "bg-red-50/40", sigla: "text-red-700 bg-red-100" },
    nao: { border: "border-emerald-200", header: "bg-emerald-50/40", sigla: "text-emerald-700 bg-emerald-100" },
    verificar: { border: "border-amber-200", header: "bg-amber-50/40", sigla: "text-amber-700 bg-amber-100" },
  };
  const c = cls[info.status];
  return (
    <div className={`bg-card rounded-lg border ${c.border} overflow-hidden shadow-sm`}>
      <div className={`${c.header} px-5 py-4 flex items-start justify-between gap-3 border-b ${c.border}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold ${c.sigla}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {sigla}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">0{index}</span>
              <h3 className="font-semibold text-foreground text-sm leading-tight">{titulo}</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitulo}</p>
          </div>
        </div>
        <StatusPill status={info.status} />
      </div>
      <div className="px-5 py-4 space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed">{info.motivo}</p>
        {info.detalhes && info.detalhes.length > 0 && (
          <div className="rounded border border-border overflow-hidden">
            {info.detalhes.map((d, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-muted/40" : "bg-card"}`}>
                <span className="text-muted-foreground flex-shrink-0 min-w-[160px] text-xs pt-0.5">{d.label}</span>
                <span className="font-medium text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>{d.valor}</span>
              </div>
            ))}
          </div>
        )}
        {info.fundamentacao && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground border-t border-border pt-3">
            <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span><strong className="text-foreground/60">Fundamentação:</strong> {info.fundamentacao}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SelectField({ label, id, value, onChange, children, required }: {
  label: string; id: string; value: string; onChange: (v: string) => void; children: React.ReactNode; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-xs font-semibold text-foreground/70 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-border bg-input-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors appearance-none cursor-pointer"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </select>
    </div>
  );
}

function TextField({ label, id, value, onChange, placeholder, mono }: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide">{label}</label>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded border border-border bg-input-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
        style={{ fontFamily: mono ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif" }} />
    </div>
  );
}

function SectionLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function MunicipioFields({ label, ufId, ufValue, onUfChange, cidadeId, cidadeValue, onCidadeChange }: {
  label: string; ufId: string; ufValue: string; onUfChange: (v: string) => void;
  cidadeId: string; cidadeValue: string; onCidadeChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide">{label}</label>
      <div className="grid grid-cols-[80px_1fr] gap-2">
        <select id={ufId} value={ufValue} onChange={(e) => onUfChange(e.target.value)}
          className="rounded border border-border bg-input-background px-2 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors appearance-none cursor-pointer"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}>
          <option value="">UF</option>
          {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
        </select>
        <input id={cidadeId} type="text" value={cidadeValue} onChange={(e) => onCidadeChange(e.target.value)}
          placeholder="Nome do município"
          className="rounded border border-border bg-input-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
          style={{ fontFamily: "'DM Sans', sans-serif" }} />
      </div>
    </div>
  );
}

const EMPTY_FORM: FormState = {
  tipoItem: "produto", codigo: "",
  regimeOrigem: "", regimeDestino: "", ufOrigem: "", ufDestino: "",
  regimePrestador: "", regimeTomador: "",
  ufPrestador: "", cidadePrestador: "", ufTomador: "", cidadeTomador: "",
  localTipo: "prestador", ufLocal: "", cidadeLocal: "",
};

export default function App() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const set = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setResultado(null);
    setErro(null);
  };

  const validar = (): string | null => {
    if (!form.codigo.trim()) return `Informe o ${form.tipoItem === "produto" ? "NCM" : "Código de Serviço"}.`;
    if (form.tipoItem === "produto") {
      if (!form.regimeOrigem || !form.regimeDestino) return "Informe os regimes tributários de origem e destino.";
      if (!form.ufOrigem || !form.ufDestino) return "Informe as UFs de origem e destino.";
    } else {
      if (!form.regimePrestador || !form.regimeTomador) return "Informe o regime tributário do prestador e do tomador.";
      if (!form.ufPrestador || !form.cidadePrestador.trim()) return "Informe o município do prestador (UF + cidade).";
      if (!form.ufTomador || !form.cidadeTomador.trim()) return "Informe o município do tomador (UF + cidade).";
      if (form.localTipo === "outro" && (!form.ufLocal || !form.cidadeLocal.trim())) return "Informe o município onde o serviço foi prestado.";
    }
    return null;
  };

  const consultar = () => {
    const err = validar();
    if (err) { setErro(err); return; }
    setErro(null);
    setResultado(calcular(form));
  };

  const isProduto = form.tipoItem === "produto";

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="bg-primary text-primary-foreground border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                Consulta de Obrigações Tributárias
              </h1>
              <p className="text-xs text-white/60 mt-0.5">ST · DIFAL · Retenção de ISS</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/40 font-mono">
            <span>LC 116/2003 · EC 87/2015 · LC 190/2022</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">

          {/* Form */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-muted/30">
                <h2 className="text-sm font-semibold text-foreground">Dados da Operação</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Informe os parâmetros para a consulta</p>
              </div>

              <div className="px-5 py-5 space-y-5">
                {/* Tipo */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide">Tipo de Item</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["produto", "servico"] as const).map((tipo) => (
                      <button key={tipo} onClick={() => { set("tipoItem", tipo); set("codigo", ""); }}
                        className={`py-2.5 px-3 rounded border text-sm font-medium transition-all ${form.tipoItem === tipo ? "bg-primary text-primary-foreground border-primary" : "bg-input-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`}>
                        {tipo === "produto" ? "Produto (NCM)" : "Serviço (LC 116)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Código */}
                <TextField
                  label={isProduto ? "NCM — Nomenclatura Comum do Mercosul" : "Código de Serviço (LC 116/2003)"}
                  id="codigo" value={form.codigo} onChange={(v) => set("codigo", v)}
                  placeholder={isProduto ? "Ex: 2203.00.00" : "Ex: 07.02"} mono
                />

                <div className="border-t border-border" />

                {isProduto ? (
                  <>
                    <SectionLabel>Partes da Operação</SectionLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <SelectField label="Regime Origem" id="regimeOrigem" value={form.regimeOrigem} onChange={(v) => set("regimeOrigem", v)} required>
                        <option value="">Selecione</option>
                        {REGIMES_PRODUTO.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </SelectField>
                      <SelectField label="Regime Destino" id="regimeDestino" value={form.regimeDestino} onChange={(v) => set("regimeDestino", v)} required>
                        <option value="">Selecione</option>
                        {REGIMES_PRODUTO.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </SelectField>
                    </div>
                    <SectionLabel>Localização</SectionLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <SelectField label="UF Origem" id="ufOrigem" value={form.ufOrigem} onChange={(v) => set("ufOrigem", v)} required>
                        <option value="">Selecione</option>
                        {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </SelectField>
                      <SelectField label="UF Destino" id="ufDestino" value={form.ufDestino} onChange={(v) => set("ufDestino", v)} required>
                        <option value="">Selecione</option>
                        {UF_LIST.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                      </SelectField>
                    </div>
                  </>
                ) : (
                  <>
                    <SectionLabel>Partes do Serviço</SectionLabel>
                    <div className="grid grid-cols-2 gap-3">
                      <SelectField label="Regime Prestador" id="regimePrestador" value={form.regimePrestador} onChange={(v) => set("regimePrestador", v)} required>
                        <option value="">Selecione</option>
                        {REGIMES_PRESTADOR.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </SelectField>
                      <SelectField label="Regime Tomador" id="regimeTomador" value={form.regimeTomador} onChange={(v) => set("regimeTomador", v)} required>
                        <option value="">Selecione</option>
                        {REGIMES_TOMADOR.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </SelectField>
                    </div>

                    <SectionLabel icon={<MapPin className="w-3 h-3" />}>Municípios</SectionLabel>

                    <MunicipioFields
                      label="Município do Prestador *"
                      ufId="ufPrestador" ufValue={form.ufPrestador} onUfChange={(v) => set("ufPrestador", v)}
                      cidadeId="cidadePrestador" cidadeValue={form.cidadePrestador} onCidadeChange={(v) => set("cidadePrestador", v)}
                    />

                    <MunicipioFields
                      label="Município do Tomador *"
                      ufId="ufTomador" ufValue={form.ufTomador} onUfChange={(v) => set("ufTomador", v)}
                      cidadeId="cidadeTomador" cidadeValue={form.cidadeTomador} onCidadeChange={(v) => set("cidadeTomador", v)}
                    />

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wide">Local de Prestação do Serviço *</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["prestador", "tomador", "outro"] as LocalTipo[]).map((op) => (
                          <button key={op} onClick={() => set("localTipo", op)}
                            className={`py-2 px-2 rounded border text-xs font-medium transition-all capitalize ${form.localTipo === op ? "bg-primary text-primary-foreground border-primary" : "bg-input-background text-muted-foreground border-border hover:border-primary/40"}`}>
                            {op === "prestador" ? "No Prestador" : op === "tomador" ? "No Tomador" : "Outro local"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.localTipo === "outro" && (
                      <MunicipioFields
                        label="Município onde o serviço foi prestado *"
                        ufId="ufLocal" ufValue={form.ufLocal} onUfChange={(v) => set("ufLocal", v)}
                        cidadeId="cidadeLocal" cidadeValue={form.cidadeLocal} onCidadeChange={(v) => set("cidadeLocal", v)}
                      />
                    )}
                  </>
                )}

                {erro && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button onClick={consultar}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded py-3 px-4 text-sm font-semibold hover:bg-primary/90 active:bg-primary/80 transition-colors">
                    <Search className="w-4 h-4" />Consultar
                  </button>
                  <button onClick={() => { setForm(EMPTY_FORM); setResultado(null); setErro(null); }} title="Limpar"
                    className="px-3 py-3 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-3.5 rounded-lg border border-border bg-card text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground/60 uppercase tracking-wide text-[10px] mb-2">Aviso legal</p>
              <p>Orientação baseada na legislação federal vigente. Para cada operação, confirme sempre a legislação estadual e municipal específica, os Convênios ICMS no CONFAZ e a lei do município do tomador para o ISS.</p>
            </div>
          </div>

          {/* Results */}
          <div>
            {!resultado ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground/60" style={{ fontFamily: "'Lora', serif" }}>
                    Aguardando consulta
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Preencha os dados da operação e clique em <strong>Consultar</strong> para verificar as obrigações tributárias aplicáveis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between px-5 py-3.5 bg-card rounded-lg border border-border shadow-sm">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Lora', serif" }}>Resultado da Consulta</h2>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{form.codigo}</p>
                  </div>
                  <div className="flex gap-1.5 items-center">
                    {[resultado.st, resultado.difal, resultado.iss].map((r, i) => (
                      <span key={i}
                        className={`w-2.5 h-2.5 rounded-full ${r.status === "sim" ? "bg-red-400" : r.status === "nao" ? "bg-emerald-400" : "bg-amber-400"}`}
                        title={["ST", "DIFAL", "ISS"][i] + ": " + r.status}
                      />
                    ))}
                  </div>
                </div>

                <TaxCard index={1} sigla="ST" titulo="Substituição Tributária"
                  subtitulo="Regime de antecipação do recolhimento do ICMS — CONFAZ" info={resultado.st} />
                <TaxCard index={2} sigla="DF" titulo="DIFAL — Diferencial de Alíquota"
                  subtitulo="EC 87/2015 · LC 190/2022 · operações interestaduais" info={resultado.difal} />
                <TaxCard index={3} sigla="IS" titulo="Retenção de ISS na Fonte"
                  subtitulo="LC 116/2003 · competência municipal" info={resultado.iss} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
