import { ChapterComplete, ChatLog, MemoryFlash, OptionalEvidence } from "../components/StoryBits";
import { OrderPuzzle, PuzzleFrame, TextPuzzle, type OrderItem } from "../components/PuzzleKit";
import type { ChapterViewProps } from "./types";

const nightItems: OrderItem[] = [
  { id: "start", label: "洞天皮肤启动", clue: "群公告定时发布 23:57" },
  { id: "tang", label: "唐雨从同学记忆中消失", clue: "程澈 00:18 写下备份" },
  { id: "he", label: "何简发现第八槽位", clue: "缓存真实时间 00:41" },
  { id: "lu", label: "陆昭拒绝停止测试", clue: "管理员操作 01:06" },
  { id: "replace", label: "程澈替换第八槽位", clue: "源码提交 02:24" },
  { id: "paper", label: "闻岚写下封存方法", clue: "传真页脚 02:48" },
  { id: "argument", label: "兄弟最后一次争吵", clue: "短信发送 03:12" }
];

const layerItems: OrderItem[] = [
  { id: "journal", label: "日志", clue: "藏下真实姓名" },
  { id: "album", label: "相册", clue: "拆散人物外貌" },
  { id: "guestbook", label: "留言", clue: "令证词互相印证" },
  { id: "friends", label: "好友", clue: "建立七人关系链" },
  { id: "music", label: "音乐", clue: "同步七台设备" },
  { id: "visitors", label: "访客", clue: "让见证者依次入场" },
  { id: "profile", label: "资料", clue: "最后切断亲缘" }
];

export default function Chapter4({
  state,
  isSolved,
  solve,
  requestHint,
  canAdvance,
  onAdvance
}: ChapterViewProps) {
  const solvedNight = isSolved("ch4-night");
  const solvedLayers = isSolved("ch4-layers");
  const solvedArgument = isSolved("ch4-argument");
  const diaryCollected = isSolved("optional-luqing-diary");

  return (
    <div className="chapter-view night-theme">
      <OptionalEvidence
        title="陆青的纸质日记"
        description="陆昭的抽屉扫描件：2007 年前的每一页都有姐姐陆青的笔迹，2007 年后所有合照却只有陆昭一人。这是《开籍》所需的另一份可选记录。"
        image={{
          src: `${import.meta.env.BASE_URL}assets/photos/luqing-diary.jpg`,
          alt: "摊开的旧日记夹着一张合影，照片右侧人物被反复刮除，只剩左侧少年",
          caption: "扫描件 07/12 · 右侧人物区域存在反复刮擦"
        }}
        collected={diaryCollected}
        onCollect={() => solve("optional-luqing-diary", ["luqing-diary"])}
      />

      <article className="retro-post compact">
        <header>
          <span className="post-category">[北窗 / 加密草稿]</span>
          <h2>我只需要七个人相信她存在</h2>
          <p>未发布 · 2010-08-27</p>
        </header>
        <div className="post-body">
          <p>陆青不是死了。死了的人至少还有墓碑。她是从所有人的记录里空掉了。</p>
          <p>洞天皮肤能把七个人的见证汇到第八个位置。第八个位置应该是她。</p>
          <p>可是恢复出来的脸，为什么每刷新一次都不一样？</p>
        </div>
      </article>

      <PuzzleFrame
        id="ch4-night"
        title="重建 2010 年最后一夜"
        eyebrow="谜题 10 / 事件校时"
        state={state}
        solved={solvedNight}
        hints={[
          "七条材料已经标出校正后的真实时间，按 23:57 到 03:12 排列。",
          "程澈替换槽位发生在陆昭拒绝停止之后，闻岚写规则之前。",
          "顺序：启动、唐雨消失、何简发现、陆昭拒绝、程澈替换、闻岚写规则、兄弟争吵。"
        ]}
        onHint={requestHint}
        onSkip={() => solve("ch4-night")}
        solvedText="最后一夜的操作链已经恢复，程澈是主动进入第八槽位的。"
      >
        <OrderPuzzle
          items={nightItems}
          correctOrder={["start", "tang", "he", "lu", "replace", "paper", "argument"]}
          instruction="依照校正后的时间，把事件从 23:57 排到 03:12。"
          onCorrect={() => solve("ch4-night")}
        />
      </PuzzleFrame>

      {solvedNight && (
        <PuzzleFrame
          id="ch4-layers"
          title="按仪式作用叠回七层空间皮肤"
          eyebrow="谜题 11 / 符式"
          state={state}
          solved={solvedLayers}
          hints={[
            "先保存姓名与外貌，再建立留言、好友和设备同步，最后处理访客与个人资料。",
            "前三层依次为日志、相册、留言；最后两层是访客、资料。",
            "完整顺序：日志、相册、留言、好友、音乐、访客、资料。"
          ]}
          onHint={requestHint}
          onSkip={() => solve("ch4-layers", ["seal-rule"])}
          solvedText="隐藏文字显现：名归日志，形散相册，缘断至亲。"
        >
          <OrderPuzzle
            items={layerItems}
            correctOrder={["journal", "album", "guestbook", "friends", "music", "visitors", "profile"]}
            instruction="每一层都以空间功能伪装。根据作用先后依次叠放。"
            onCorrect={() => solve("ch4-layers", ["seal-rule"])}
          />
        </PuzzleFrame>
      )}

      {solvedLayers && (
        <>
          <div className="seal-rule">
            <span>名归日志</span>
            <span>形散相册</span>
            <span>缘断至亲</span>
          </div>
          <ChatLog
            messages={[
              { sender: "程澈", time: "03:10", text: "你不是一直觉得没有我更好吗？" },
              { sender: "程砚", time: "03:11", text: "别闹了，我明天还要返校。" },
              { sender: "程澈", time: "03:11", text: "那你说啊。说你不认我。" },
              { sender: "程砚", time: "03:12", text: "□□□□□□□。", tone: "warning" }
            ]}
          />
          <PuzzleFrame
            id="ch4-argument"
            title="恢复程砚发出的最后一句话"
            eyebrow="谜题 12 / 缘"
            state={state}
            solved={solvedArgument}
            hints={[
              "这句话正是第一章日志反复追问的内容。",
              "它切断的不是账号好友关系，而是“哥哥”这个称呼。",
              "答案是“以后别再叫我哥”。"
            ]}
            onHint={requestHint}
            onSkip={() => solve("ch4-argument", ["last-argument"])}
            solvedText="最后亲缘被切断，程澈的自我封存于 03:17 完成。"
          >
            <TextPuzzle
              label="恢复七个被遮挡的字"
              accepted={["以后别再叫我哥", "别再叫我哥"]}
              placeholder="□□□□□□□"
              onCorrect={() => solve("ch4-argument", ["last-argument"])}
            />
          </PuzzleFrame>
        </>
      )}

      {solvedArgument && (
        <>
          <MemoryFlash label="完整记忆">
            程澈不是在求你憎恨他。他在等一句能让世界相信“你们不再是兄弟”的话。你说出口后，他只回了一个“好”。
          </MemoryFlash>
          <div className="seal-dashboard">
            <div><span>名</span><strong>100%</strong><small>第一章已恢复</small></div>
            <div><span>形</span><strong>92%</strong><small>相册正在重组</small></div>
            <div><span>缘</span><strong>97%</strong><small>“哥哥”关系已建立</small></div>
            <p>封存完整度：<strong>3%</strong>　你此前完成的每一道题都在撤销封存。</p>
          </div>
          <ChatLog
            messages={[
              { sender: "鹤归", time: "现在", text: "哥，这次你还要说不认我吗？" },
              { sender: "纸鸢", time: "现在", text: "不要回答。程澈当年没有给自己留下实时聊天。", tone: "warning" }
            ]}
          />
        </>
      )}

      {canAdvance && <ChapterComplete nextTitle="第五章《哥，如果你还记得我》" onAdvance={onAdvance} />}
    </div>
  );
}
