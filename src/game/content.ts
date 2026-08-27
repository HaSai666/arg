import type { ChapterMeta, EndingDefinition, Profile } from "./types";

export const profiles: Profile[] = [
  {
    id: "cheng-che",
    name: "程澈",
    nickname: "鹤归",
    age2010: 13,
    role: "洞天皮肤维护者",
    signature: "有些东西删掉了，也会回来。",
    color: "#4c70b8",
    initials: "澈",
    status: "已除名",
    evidence: "把真名藏进日志、外貌拆进照片，并切断最后亲缘。"
  },
  {
    id: "tang-yu",
    name: "唐雨",
    nickname: "半糖",
    age2010: 13,
    role: "程澈同班同学",
    signature: "踩踩不跑堂，回访留爪～",
    color: "#df6ea6",
    initials: "糖",
    status: "首位受害者",
    evidence: "她的留言被现实重新分配给其他账号。"
  },
  {
    id: "gao-yue",
    name: "高越",
    nickname: "逆光℃",
    age2010: 15,
    role: "摄影社学长",
    signature: "照片不会说谎，人会。",
    color: "#4b8a79",
    initials: "光",
    status: "存活但失忆",
    evidence: "手机照片里有八道影子，他却只记得七个人。"
  },
  {
    id: "wen-lan",
    name: "闻岚",
    nickname: "纸鸢",
    age2010: 15,
    role: "外地网友",
    signature: "名字不要随便写给别人看。",
    color: "#b47a41",
    initials: "鸢",
    status: "当下在线",
    evidence: "纸质笔记令她保留了部分不受数据改写的记忆。"
  },
  {
    id: "he-jian",
    name: "何简",
    nickname: "H_404",
    age2010: 16,
    role: "技术论坛网友",
    signature: "404 不是没有，只是服务器不肯给你。",
    color: "#56647c",
    initials: "404",
    status: "第二位受害者",
    evidence: "发现 CSS 有八个槽位，第八个读取当前访客。"
  },
  {
    id: "xu-yan",
    name: "许妍",
    nickname: "夜曲FM",
    age2010: 14,
    role: "空间音乐上传者",
    signature: "晚安，世界。耳机别摘。",
    color: "#7c5ca7",
    initials: "FM",
    status: "存活但失声",
    evidence: "录音捕捉到第八个呼吸，她的声音后来被借用。"
  },
  {
    id: "lu-zhao",
    name: "陆昭",
    nickname: "北窗",
    age2010: 17,
    role: "测试群发起者",
    signature: "存在，就是被足够多的人相信。",
    color: "#8e4d55",
    initials: "北",
    status: "下落不明",
    evidence: "为找回 2007 年被除名的姐姐陆青，明知危险仍启动测试。"
  }
];

export const chapters: ChapterMeta[] = [
  {
    id: 1,
    title: "特别关心",
    date: "2026.08.27 / 2010.08.27",
    objective: "确认“程澈”曾经存在",
    page: "space",
    puzzleIds: ["ch1-colored", "ch1-photos", "ch1-name"]
  },
  {
    id: 2,
    title: "七个账号",
    date: "2010.08.26",
    objective: "恢复测试群与第七位成员",
    page: "group",
    puzzleIds: ["ch2-voices", "ch2-seventh", "ch2-chain"]
  },
  {
    id: 3,
    title: "第八位访客",
    date: "2010.08.27 00:12",
    objective: "证明异常没有固定账号",
    page: "cache",
    puzzleIds: ["ch3-timeline", "ch3-language", "ch3-slot"]
  },
  {
    id: 4,
    title: "除名之夜",
    date: "2010.08.27 03:17",
    objective: "重建程澈的自我封存",
    page: "space",
    puzzleIds: ["ch4-night", "ch4-layers", "ch4-argument"]
  },
  {
    id: 5,
    title: "哥，如果你还记得我",
    date: "正在同步",
    objective: "处置名、形、缘",
    page: "migration",
    puzzleIds: []
  }
];

export const endings: EndingDefinition[] = [
  {
    id: "return",
    title: "归人",
    verb: "承认程澈",
    summary: "提交“程澈是我的弟弟”，让名、形、缘重新合一。",
    consequence: "程澈作为成年人回到家庭，但他的声音与照片留下第八位访客的痕迹。"
  },
  {
    id: "seal",
    title: "封名",
    verb: "再次遗忘",
    summary: "删除真名、封存照片并拒绝亲缘。",
    consequence: "程砚忘记整场调查；母亲仍会下意识多摆一副碗筷。"
  },
  {
    id: "exchange",
    title: "换籍",
    verb: "以兄代弟",
    summary: "将程砚自己的名、形、缘填入空位。",
    consequence: "程澈回到现实，程砚被除名；一切以新的收件人重新开始。"
  },
  {
    id: "open_registry",
    title: "开籍",
    verb: "公开所有记录",
    summary: "把全部遗留数据库公开，让每个无名者重新被看见。",
    consequence: "现实同时接纳互相冲突的人生，新增账号数超过城市历史人口。"
  }
];

export const corePuzzleIds = chapters.flatMap((chapter) => chapter.puzzleIds);

export const artifacts = [
  { id: "mail", label: "异常通知", detail: "来自停运平台的“特别关心”邮件。" },
  { id: "family-gap", label: "缺席的合照", detail: "四张照片都为同一个人留下位置。" },
  { id: "true-name", label: "程澈的真名", detail: "名已恢复；现实记录仍拒绝承认。" },
  { id: "tang-yu", label: "唐雨资料卡", detail: "第七位成员、也是第一位受害者。" },
  { id: "group-chain", label: "测试接力", detail: "七次访问形成皮肤启动顺序。" },
  { id: "eighth-track", label: "第八条轨迹", detail: "它依次借用了七个人的头像。" },
  { id: "slot-source", label: "第八槽位源码", detail: "slot[8] 读取当前访客身份。" },
  { id: "xu-audio", label: "许妍的双声道录音", detail: "拼接声音说：“借我一个名字。”" },
  { id: "luqing-diary", label: "陆青纸质日记", detail: "陆昭仍记得姐姐的唯一原因。" },
  { id: "seal-rule", label: "封存规则", detail: "名归日志，形散相册，缘断至亲。" },
  { id: "last-argument", label: "最后的争吵", detail: "“以后别再叫我哥。”" }
];
