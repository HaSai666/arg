import { ChapterComplete, ChatLog, MemoryFlash, OptionalEvidence, SideThread } from "../components/StoryBits";
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
  const scoreKept = isSolved("side-lu-score");
  const craneKept = isSolved("side-paper-crane");

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

      <SideThread
        kicker="旧手机备份 / games.dat"
        title="陆昭始终没打破的最高分"
        teaser="排行榜第一名属于一个不存在的玩家"
        entries={[
          { meta: "贪吃蛇 / 2006", text: "HIGH SCORE：LUQING 18320。第二名 BEICHUANG 18110，差两百一十分。" },
          { meta: "北窗备注", text: "姐说破两万就把随身听给我。她不在以后，所有人都说这个名字是我自己输进去的。" },
          { meta: "2010-08-27", text: "排行榜刷新出第八行：LUQING 18321。游戏文件最后修改时间却停在 2007 年。" }
        ]}
        collected={scoreKept}
        onCollect={() => solve("side-lu-score", ["side-lu-score"])}
        collectLabel="冻结这张排行榜"
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
        eyebrow="系统事件 / 03:17 前"
        state={state}
        solved={solvedNight}
        marginalia={[
          { mark: "单", source: "拨号上网账单", text: "连接从 23:57 开始；00:18 后唐雨的账号不再产生流量，何简的缓存写入发生在 00:41。", placement: "right" },
          { mark: "git", source: "提交记录背面", text: "陆昭在 01:06 拒绝关停；程澈到 02:24 才替换槽位，闻岚的传真又晚了二十四分钟。", placement: "left" },
          { mark: "信", source: "短信送达回执", text: "传真之后只剩 03:12 的兄弟争吵。所有动作都发生在 03:17 封存完成之前。", placement: "bottom" }
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
        <>
        <SideThread
          kicker="传真机缓存 / 多出一页"
          title="闻岚折了八只纸鹤"
          teaser="她只记得寄出了七只"
          entries={[
            { meta: "2010-08-27 02:31", text: "纸鸢：我把封存步骤分别写进七只纸鹤，谁都不要在网上抄全。纸比账号可靠。" },
            { meta: "邮寄清单", text: "收件地址只有七个。扫描图里却排着八只，第八只纸上写的是“给程澈的哥哥”。" },
            { meta: "退件 / 无邮戳", text: "第八只后来回到闻岚抽屉，里面换成另一种笔迹：别让他认出我。" }
          ]}
          collected={craneKept}
          onCollect={() => solve("side-paper-crane", ["side-paper-crane"])}
          collectLabel="把第八只夹进便签"
        />
        <PuzzleFrame
          id="ch4-layers"
          title="按仪式作用叠回七层空间皮肤"
          eyebrow="装扮层级 / 七重符式"
          state={state}
          solved={solvedLayers}
          marginalia={[
            { mark: "读", source: "皮肤安装说明", text: "载入时先写入姓名，再拆分外貌；证词必须先于关系链，设备同步又必须先于访客入场。", placement: "left" },
            { mark: "符", source: "传真纸背面", text: "前三笔旁注依次写着“日志藏名、相册散形、留言作证”；末两笔是访客与资料。", placement: "right" },
            { mark: "ini", source: "skin.ini 载入序", text: "journal, album, guestbook, friends, music, visitors, profile。文件末尾多了一行没有名称的 layer8。", placement: "bottom" }
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
        </>
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
            eyebrow="短信缓存 / 最后一行"
            state={state}
            solved={solvedArgument}
            marginalia={[
              { mark: "回", source: "首章镜像", text: "最早恢复的日志一直追问同一句话：你后来为什么不准他再叫你“哥”？", placement: "right" },
              { mark: "缘", source: "关系表残项", text: "删除好友没有完成封存。最后被切断的是“哥哥”这一亲缘称谓，缓存长度为七个字。", placement: "left" },
              { mark: "T9", source: "输入法历史", text: "七个字依次留下：以后 / 别 / 再 / 叫 / 我 / 哥。第一个词在短信框里占了两个字。", placement: "bottom" }
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
