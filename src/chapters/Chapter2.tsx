import { ChapterComplete, ChatLog, ProfileChip } from "../components/StoryBits";
import { OrderPuzzle, PuzzleFrame, SelectMapPuzzle, TextPuzzle, type OrderItem } from "../components/PuzzleKit";
import { profiles } from "../game/content";
import type { ChapterViewProps } from "./types";

const chainItems: OrderItem[] = [
  { id: "beichuang", label: "北窗", clue: "群公告的发布者，最先安装" },
  { id: "hegui", label: "鹤归", clue: "北窗留言：下一站交给你" },
  { id: "bantang", label: "半糖", clue: "鹤归回复：先去我同桌那里" },
  { id: "niguang", label: "逆光℃", clue: "半糖留言：学长记得拍照" },
  { id: "yequ", label: "夜曲FM", clue: "逆光℃：拍完去听新歌" },
  { id: "h404", label: "H_404", clue: "夜曲FM：播放器坏了找何简" },
  { id: "zhiyuan", label: "纸鸢", clue: "H_404：最后一份交给懂纸的人" }
];

export default function Chapter2({
  state,
  isSolved,
  solve,
  requestHint,
  canAdvance,
  onAdvance
}: ChapterViewProps) {
  const solvedVoices = isSolved("ch2-voices");
  const solvedSeventh = isSolved("ch2-seventh");
  const solvedChain = isSolved("ch2-chain");

  return (
    <div className="chapter-view">
      <header className="group-header">
        <div>
          <span>星语群组 / 非公开</span>
          <h2>羽化测试群</h2>
          <p>成员：7　可见资料卡：6　创建人：北窗</p>
        </div>
        <span className="group-badge">测试版皮肤互助</span>
      </header>

      <div className="profile-chip-grid">
        {profiles.filter((profile) => profile.id !== "tang-yu").map((profile) => (
          <ProfileChip key={profile.id} profile={profile} />
        ))}
        <div className="profile-chip missing">
          <span className="mini-avatar">?</span>
          <span><strong>资料不可用</strong><small>成员索引 07</small></span>
        </div>
      </div>

      <PuzzleFrame
        id="ch2-voices"
        title="把错位留言还给原作者"
        eyebrow="谜题 04 / 账号口癖"
        state={state}
        solved={solvedVoices}
        hints={[
          "何简谈缓存与 hash；闻岚忌讳公开真名。",
          "甜腻表情属于不可见的第七位成员。",
          "依次选择：半糖、H_404、纸鸢。"
        ]}
        onHint={requestHint}
        onSkip={() => solve("ch2-voices")}
        solvedText="三条留言已恢复原始发送者，剩下一种口吻没有资料卡。"
      >
        <SelectMapPuzzle
          prompts={[
            { id: "sweet", quote: "踩过啦～记得回访嗷 \(≧▽≦)/" },
            { id: "hash", quote: "缓存里这个不是我提交的 hash。" },
            { id: "name", quote: "别把真名写进皮肤配置里。" }
          ]}
          options={["鹤归", "逆光℃", "纸鸢", "H_404", "夜曲FM", "北窗", "半糖"]}
          correct={{ sweet: "半糖", hash: "H_404", name: "纸鸢" }}
          onCorrect={() => solve("ch2-voices")}
        />
      </PuzzleFrame>

      {solvedVoices && (
        <PuzzleFrame
          id="ch2-seventh"
          title="恢复第七张资料卡"
          eyebrow="谜题 05 / 被删账号"
          state={state}
          solved={solvedSeventh}
          hints={[
            "缓存头像目录为 /ty/bantang/，相册评论称她“小雨”。",
            "学校花名册残片显示姓唐。",
            "她的真实姓名是“唐雨”，昵称“半糖”。"
          ]}
          onHint={requestHint}
          onSkip={() => solve("ch2-seventh", ["tang-yu"])}
          solvedText="第七位成员唐雨（半糖）已经恢复。"
        >
          <div className="cache-fragments">
            <code>/avatar/ty/bantang_07.gif</code>
            <span>“小雨今天又没来早读。”</span>
            <span>花名册：唐□　初一（3）班</span>
          </div>
          <TextPuzzle
            label="输入真实姓名或账号昵称"
            accepted={["唐雨", "半糖"]}
            placeholder="两到三个字"
            onCorrect={() => solve("ch2-seventh", ["tang-yu"])}
          />
        </PuzzleFrame>
      )}

      {solvedSeventh && (
        <>
          <article className="retro-post compact">
            <header><h3>半糖最后一条可见日志</h3><p>2010-08-26 23:48</p></header>
            <div className="post-body">
              <p>鹤归，如果明天我没来学校，你要记得不是因为我请假。</p>
              <p>刚才谁用我的号说话？我没有发过那句话。</p>
            </div>
          </article>
          <PuzzleFrame
            id="ch2-chain"
            title="还原七人皮肤测试接力"
            eyebrow="谜题 06 / 访问顺序"
            state={state}
            solved={solvedChain}
            hints={[
              "从群公告发布者北窗开始，逐条追踪“下一站”。",
              "北窗之后是鹤归；半糖在鹤归之后；纸鸢最后。",
              "完整顺序：北窗、鹤归、半糖、逆光℃、夜曲FM、H_404、纸鸢。"
            ]}
            onHint={requestHint}
            onSkip={() => solve("ch2-chain", ["group-chain"])}
            solvedText="七次访问已经恢复；安装统计却记录了第八次。"
          >
            <OrderPuzzle
              items={chainItems}
              correctOrder={["beichuang", "hegui", "bantang", "niguang", "yequ", "h404", "zhiyuan"]}
              instruction="根据每个人留下的“下一站”留言依次点击账号。"
              onCorrect={() => solve("ch2-chain", ["group-chain"])}
            />
          </PuzzleFrame>
        </>
      )}

      {solvedChain && (
        <>
          <div className="install-counter">
            <span>洞天·beta</span>
            <strong>已有 8 位用户启用此装扮</strong>
          </div>
          <ChatLog
            messages={[
              { sender: "纸鸢", time: "现在", text: "你是谁？为什么你还记得半糖？" },
              { sender: "纸鸢", time: "现在", text: "从现在开始，不要相信任何用我头像发来的话。", tone: "warning" },
              { sender: "程砚", time: "现在", text: "群里明明只有七个账号。" },
              { sender: "纸鸢", time: "现在", text: "不对。那天活着的只有七个。", tone: "warning" }
            ]}
          />
        </>
      )}

      {canAdvance && <ChapterComplete nextTitle="第三章《第八位访客》" onAdvance={onAdvance} />}
    </div>
  );
}
