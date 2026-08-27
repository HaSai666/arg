async (page) => {
  const baseState = {
    schemaVersion: 1,
    started: true,
    activePage: "space",
    solvedPuzzleIds: [],
    collectedArtifactIds: ["mail"],
    hintLevels: {},
    attention: 0,
    trustWenLan: 0,
    audioEnabled: false,
    reducedMotion: false,
    highContrast: false,
    endingHistory: [],
    updatedAt: new Date().toISOString()
  };

  const setStory = async (state) => {
    await page.evaluate((nextState) => {
      localStorage.setItem("xingyu-space-save-v1", JSON.stringify(nextState));
    }, { ...baseState, ...state, updatedAt: new Date().toISOString() });
    await page.reload();
    await page.locator(".chapter-view, .ending-screen").first().waitFor({ state: "visible" });
  };

  const assertNoIntrusiveLabels = async () => {
    const text = await page.locator("body").innerText();
    for (const label of ["请求线索", "再给一点线索", "使用答案并继续", "通关秘籍"]) {
      if (text.includes(label)) throw new Error(`仍存在出戏文案：${label}`);
    }
  };

  const openAndKeepThreads = async (expectedCount) => {
    const threads = page.locator(".side-thread");
    if (await threads.count() !== expectedCount) {
      throw new Error(`边角记录数量不符：预期 ${expectedCount}，实际 ${await threads.count()}`);
    }
    for (let index = 0; index < expectedCount; index += 1) {
      const thread = threads.nth(index);
      await thread.locator(".side-thread-tab").click();
      const keep = thread.locator(".thread-keep");
      await keep.click();
      if (!(await keep.isDisabled())) throw new Error("边角记录没有保存到便签");
    }
  };

  await page.setViewportSize({ width: 1280, height: 900 });
  await setStory({
    chapter: 1,
    activePage: "space",
    solvedPuzzleIds: ["ch1-colored", "ch1-photos"],
    collectedArtifactIds: ["mail", "family-gap"]
  });
  await assertNoIntrusiveLabels();
  const namePuzzle = page.locator('[aria-labelledby="ch1-name-title"]');
  for (let index = 0; index < 3; index += 1) {
    await namePuzzle.locator(".marginal-trigger").click();
  }
  if (await namePuzzle.locator(".paper-scrap").count() !== 3) {
    throw new Error("三层边角旁证未依次显现");
  }
  await namePuzzle.locator(".mirror-recovery").waitFor({ state: "visible" });
  await namePuzzle.screenshot({ path: "output/playwright/marginalia-desktop.png" });
  await openAndKeepThreads(1);
  await page.locator(".side-thread").screenshot({ path: "output/playwright/thread-bowls.png" });

  const chapterOne = ["ch1-colored", "ch1-photos", "ch1-name"];
  const chapterTwo = ["ch2-voices", "ch2-seventh", "ch2-chain"];
  await setStory({
    chapter: 2,
    activePage: "group",
    solvedPuzzleIds: [...chapterOne, ...chapterTwo],
    collectedArtifactIds: ["mail", "family-gap", "true-name", "tang-yu", "group-chain"]
  });
  await assertNoIntrusiveLabels();
  await openAndKeepThreads(2);
  await page.locator(".side-thread").last().screenshot({ path: "output/playwright/thread-negative.png" });

  const chapterThree = ["ch3-timeline", "ch3-language", "ch3-slot"];
  await setStory({
    chapter: 3,
    activePage: "cache",
    solvedPuzzleIds: [...chapterOne, ...chapterTwo, ...chapterThree],
    collectedArtifactIds: ["mail", "family-gap", "true-name", "tang-yu", "group-chain", "eighth-track", "slot-source"]
  });
  await assertNoIntrusiveLabels();
  await openAndKeepThreads(2);

  const chapterFourStart = ["ch4-night"];
  await setStory({
    chapter: 4,
    activePage: "space",
    solvedPuzzleIds: [...chapterOne, ...chapterTwo, ...chapterThree, ...chapterFourStart],
    collectedArtifactIds: ["mail", "family-gap", "true-name", "tang-yu", "group-chain", "eighth-track", "slot-source"]
  });
  await assertNoIntrusiveLabels();
  await openAndKeepThreads(2);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileThread = page.locator(".side-thread").last();
  await mobileThread.scrollIntoViewIfNeeded();
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)) {
    throw new Error("手机端边角记录造成横向溢出");
  }
  await mobileThread.screenshot({ path: "output/playwright/thread-mobile.png" });

  const allSideRecords = [
    "side-three-bowls",
    "side-bantang-vote",
    "side-gao-negative",
    "side-xu-playlist",
    "side-he-draft",
    "side-lu-score",
    "side-paper-crane"
  ];
  await page.setViewportSize({ width: 1280, height: 900 });
  await setStory({
    chapter: 5,
    activePage: "migration",
    solvedPuzzleIds: [...chapterOne, ...chapterTwo, ...chapterThree, "ch4-night", "ch4-layers", "ch4-argument"],
    collectedArtifactIds: ["mail", ...allSideRecords],
    ending: "seal",
    endingHistory: ["seal"]
  });
  await page.getByText(/七段无关记录首尾相接/).waitFor({ state: "visible" });
  await assertNoIntrusiveLabels();
}
