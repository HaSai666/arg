import { useState } from "react";
import { ArchiveNotice, ChapterComplete, ChatLog, FauxPhoto, MemoryFlash, SideThread } from "../components/StoryBits";
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
  const bowlsKept = isSolved("side-three-bowls");

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
        eyebrow="缓存块 01 / 页面残字"
        state={state}
        solved={solvedColored}
        marginalia={[
          { mark: "染", source: "装扮说明", text: "旧版皮肤会把失效链接拆成桃红色字符；这篇日志里恰好残留五处。", placement: "right" },
          { mark: "↘", source: "状态栏残影", text: "鼠标曾按阅读顺序停在“去、旧、家、相、册”五个字上。", placement: "left" },
          { mark: "夹", source: "收藏夹同步", text: "一个被删除的收藏项目只剩地址尾部：/album/old-home。", placement: "bottom" }
        ]}
        onHint={requestHint}
        onSkip={() => solve("ch1-colored")}
        solvedText="隐藏导航“旧家相册”已经出现。"
      >
        <TextPuzzle
          label="依次输入五处桃红色文字"
          accepted={["去旧家相册", "旧家相册", "旧家"]}
          placeholder="去旧家相册"
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
            eyebrow="相册修复 / EXIF 冲突"
            state={state}
            solved={solvedPhotos}
            marginalia={[
              { mark: "修", source: "相机维修单", text: "四张文件的修改时间都被覆盖过。维修员用红笔写着：以画面里的横幅、电视角标、校牌和纸箱为准。", placement: "left" },
              { mark: "历", source: "日历挂件", text: "二〇〇九秋季在庚寅春节之前；新生报到又早于写着 2010.08 的搬家纸箱。", placement: "right" },
              { mark: "妈", source: "相册旧评论", text: "母亲：运动会那张还是旧校服，搬家前阳台那张已经是最后一卷了。", placement: "bottom" }
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
          <SideThread
            kicker="同步便签 / 系统判定无关"
            title="三碗汤圆"
            teaser="同一份购物清单在两个年份里人数不同"
            entries={[
              { meta: "2010-02-13 18:04", text: "可乐别买，两个孩子一喝就咳。汤圆三碗：阿砚不要芝麻，小澈不要花生。" },
              { meta: "2010-02-14 00:11", text: "程砚回复了一个“知道了”。下方还有一条回复，只剩时间，没有发送者。" },
              { meta: "2026-08-27 22:52", text: "云便签自动同步后，第一行变成了“一个孩子”，购物数量变成“两碗”。" }
            ]}
            collected={bowlsKept}
            onCollect={() => solve("side-three-bowls", ["side-three-bowls"])}
            collectLabel="保留同步前的清单"
          />
          <PuzzleFrame
            id="ch1-name"
            title="写下那个孩子的完整姓名"
            eyebrow="身份索引 / 姓名字段"
            state={state}
            solved={solvedName}
            marginalia={[
              { mark: "簿", source: "旧通讯录边角", text: "“阿砚 / 小澈”被写在同一个家庭号码下面，姓氏栏只填过一次。", placement: "right" },
              { mark: "名", source: "文件名解析", text: "yan_che_2010.jpg 被旧相册程序拆成两个名字：砚、澈；相册所有者姓程。", placement: "left" },
              { mark: "短", source: "未发短信", text: "母亲的草稿开头是：“程家两个孩子，砚字在前，澈字在后。”", placement: "bottom" }
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
