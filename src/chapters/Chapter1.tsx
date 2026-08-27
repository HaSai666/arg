import { useState } from "react";
import { ArchiveNotice, ChapterComplete, ChatLog, FauxPhoto, MemoryFlash } from "../components/StoryBits";
import { OrderPuzzle, PuzzleFrame, TextPuzzle, type OrderItem } from "../components/PuzzleKit";
import type { ChapterViewProps } from "./types";

const photoItems: OrderItem[] = [
  { id: "gate", label: "校门口", clue: "校牌写着 2010 届新生报到" },
  { id: "sports", label: "运动会看台", clue: "横幅残留“二〇〇九秋季”" },
  { id: "balcony", label: "旧家阳台", clue: "搬家纸箱写着 2010.08" },
  { id: "newyear", label: "春节客厅", clue: "电视角标为庚寅春节" }
];

export default function Chapter1({
  state,
  isSolved,
  solve,
  requestHint,
  canAdvance,
  onAdvance
}: ChapterViewProps) {
  const [activePhoto, setActivePhoto] = useState("sports");
  const solvedColored = isSolved("ch1-colored");
  const solvedPhotos = isSolved("ch1-photos");
  const solvedName = isSolved("ch1-name");

  return (
    <div className="chapter-view">
      <article className="retro-post">
        <header>
          <span className="post-category">[私密日志恢复]</span>
          <h2>哥，如果你还记得我</h2>
          <p>发表时间：2010-08-27 03:17　阅读(1)　评论(0)</p>
        </header>
        <div className="post-body">
          <p>你以前说，只要还有一个人记得，删掉的东西就不算消失。</p>
          <p>可你后来又说，别再叫你哥。到底哪一句算数？</p>
          <p className="colored-clue" aria-label="去旧家相册">
            <em>去</em>年夏天你把旧电脑搬回去，<em>旧</em>硬盘还在。
            <em>家</em>里的东西别问妈，去看<em>相</em>片，别只看这一<em>册</em>。
          </p>
        </div>
      </article>

      <PuzzleFrame
        id="ch1-colored"
        title="日志把你引向哪里？"
        eyebrow="谜题 01 / 页面文字"
        state={state}
        solved={solvedColored}
        hints={[
          "这篇日志里有五个字的颜色与正文不同。",
          "按阅读顺序连起这些彩色字。",
          "答案是“旧家相册”。"
        ]}
        onHint={requestHint}
        onSkip={() => solve("ch1-colored")}
        solvedText="隐藏导航“旧家相册”已经出现。"
      >
        <TextPuzzle
          label="输入日志指向的栏目"
          accepted={["旧家相册", "旧家"]}
          placeholder="五个字"
          onCorrect={() => solve("ch1-colored")}
        />
      </PuzzleFrame>

      {solvedColored && (
        <>
          <section className="album-browser">
            <div className="album-toolbar">
              <strong>相册：旧家（4）</strong>
              <span>创建于 2010-08-26</span>
            </div>
            <div className="photo-thumbs">
              {photoItems.map((item) => (
                <button
                  key={item.id}
                  className={activePhoto === item.id ? "active" : ""}
                  type="button"
                  onClick={() => setActivePhoto(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <FauxPhoto
              title={photoItems.find((item) => item.id === activePhoto)?.label ?? "旧照片"}
              date={
                activePhoto === "sports"
                  ? "2009-10-18"
                  : activePhoto === "newyear"
                    ? "2010-02-14"
                    : activePhoto === "gate"
                      ? "2010-06-28"
                      : "2010-08-25"
              }
              variant={activePhoto as "sports" | "newyear" | "gate" | "balcony"}
              note="两个人之间存在不自然的空位，一只手悬在本应有人肩膀的位置。"
            />
          </section>

          <PuzzleFrame
            id="ch1-photos"
            title="按拍摄时间排列四张照片"
            eyebrow="谜题 02 / 缺席的合照"
            state={state}
            solved={solvedPhotos}
            hints={[
              "先看横幅与春节年份，再看校牌和搬家纸箱。",
              "时间从 2009 年秋季开始，到 2010 年 8 月结束。",
              "正确顺序：运动会看台、春节客厅、校门口、旧家阳台。"
            ]}
            onHint={requestHint}
            onSkip={() => solve("ch1-photos", ["family-gap"])}
            solvedText="四张照片都为同一个孩子留下了位置。"
          >
            <OrderPuzzle
              items={photoItems}
              correctOrder={["sports", "newyear", "gate", "balcony"]}
              instruction="依次点击照片建立时间线。照片中的文字线索比文件修改时间可靠。"
              onCorrect={() => solve("ch1-photos", ["family-gap"])}
            />
          </PuzzleFrame>
        </>
      )}

      {solvedPhotos && (
        <>
          <MemoryFlash label="记忆碎片 01">
            一个十三岁左右的男孩趴在你身后改空间皮肤。他问：“如果把一个人从网上删干净，是不是真的就没人记得了？”
          </MemoryFlash>
          <ArchiveNotice>
            <p><strong>缓存交叉记录：</strong>家庭留言残留“程×”；照片文件名为 <code>yan_che_2010.jpg</code>；短信写着“阿砚，带小澈回家”。</p>
          </ArchiveNotice>
          <PuzzleFrame
            id="ch1-name"
            title="写下那个孩子的完整姓名"
            eyebrow="谜题 03 / 名"
            state={state}
            solved={solvedName}
            hints={[
              "你们拥有同一个姓；聊天里称他为“小澈”。",
              "“阿砚”是程砚，“小澈”也使用程姓。",
              "完整姓名是“程澈”。"
            ]}
            onHint={requestHint}
            onSkip={() => solve("ch1-name", ["true-name"])}
            solvedText="“名”已恢复。空间开始承认程澈。"
          >
            <TextPuzzle
              label="姓名"
              accepted={["程澈"]}
              placeholder="姓与名"
              onCorrect={() => solve("ch1-name", ["true-name"])}
            />
          </PuzzleFrame>
        </>
      )}

      {solvedName && (
        <>
          <ChatLog
            messages={[
              { sender: "程砚", time: "22:41", text: "妈，我以前是不是有个弟弟？" },
              { sender: "母亲", time: "22:43", text: "你从小就是独生子。是不是最近又没睡好？", tone: "warning" },
              { sender: "系统", time: "22:44", text: "空间名称已由“鹤归的空间”恢复为“程澈的空间”。", tone: "system" }
            ]}
          />
          <div className="visitor-anomaly">
            <strong>今日访客 2</strong>
            <span>列表中仅有：程砚（刚刚）</span>
          </div>
        </>
      )}

      {canAdvance && <ChapterComplete nextTitle="第二章《七个账号》" onAdvance={onAdvance} />}
    </div>
  );
}
