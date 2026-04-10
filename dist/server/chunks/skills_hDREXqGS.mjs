globalThis.process ??= {};
globalThis.process.env ??= {};
const skillsData = [
  {
    name: "TypeScript",
    type: "LANG",
    info: "フロントエンドやバックエンドに使用。(参照: Project03)"
  },
  {
    name: "Go",
    type: "LANG",
    info: "Atcoderにて使用。"
  },
  {
    name: "Python",
    type: "LANG",
    info: "深層学習モデルの研究開発。(参照: Project04)"
  },
  {
    name: "C++",
    type: "LANG",
    info: "アルゴリズムの勉強に使用。"
  },
  {
    name: "React / Next.js",
    type: "FRAMEWORK",
    info: "コンポーネント指向による効率的なUI構築に使用。(参照: Project03)"
  },
  {
    name: "Deep Learning",
    type: "AI",
    info: "PyTorch/TensorFlowを用いたモデル構築。CNN, Transformer等の理解。"
  },
  {
    name: "Docker",
    type: "INFRA",
    info: "再現性のある開発環境の構築に使用。"
  },
  {
    name: "Git / GitHub",
    type: "TOOL",
    info: "チーム開発におけるバージョン管理に使用。"
  },
  {
    name: "Hugging Face",
    type: "TOOL",
    info: "学習済みモデルの管理やSpacesを用いたデモ公開に使用。(参照: Project04)"
  }
];
export {
  skillsData as s
};
