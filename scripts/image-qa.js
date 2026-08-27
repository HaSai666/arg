async (page) => {
  await page.evaluate((state) => {
    localStorage.setItem("xingyu-space-save-v1", JSON.stringify(state));
  }, {
    schemaVersion: 1,
    started: true,
    chapter: 1,
    activePage: "space",
    solvedPuzzleIds: ["ch1-colored"],
    collectedArtifactIds: ["mail"],
    hintLevels: {},
    attention: 0,
    trustWenLan: 0,
    audioEnabled: false,
    reducedMotion: false,
    highContrast: false,
    endingHistory: [],
    updatedAt: new Date().toISOString()
  });
  await page.reload();
  await page.locator(".album-browser").waitFor({ state: "visible" });

  const variants = [
    ["校门口", "school-gate-gap.jpg"],
    ["运动会看台", "sports-day-gap.jpg"],
    ["旧家阳台", "balcony-gap.jpg"],
    ["春节客厅", "family-old-home.jpg"]
  ];

  for (const [label, file] of variants) {
    await page.getByRole("button", { name: label, exact: true }).click();
    const photo = page.locator(".faux-photo img");
    await photo.waitFor({ state: "visible" });
    const src = await photo.getAttribute("src");
    const loaded = await photo.evaluate((image) => image.complete && image.naturalWidth > 0);
    if (!loaded || !src?.endsWith(file)) {
      throw new Error(`相册图片未正确切换：${label}`);
    }
  }

  await page.locator(".album-browser").screenshot({
    path: "output/playwright/chapter1-album.png"
  });

  const baseState = {
    schemaVersion: 1,
    started: true,
    activePage: "space",
    solvedPuzzleIds: [
      "ch1-colored",
      "ch1-photos",
      "ch1-name",
      "ch2-voices",
      "ch2-seventh",
      "ch2-chain",
      "ch3-timeline",
      "ch3-language",
      "ch3-slot"
    ],
    collectedArtifactIds: ["mail", "family-gap", "true-name", "xu-audio"],
    hintLevels: {},
    attention: 0,
    trustWenLan: 1,
    audioEnabled: false,
    reducedMotion: false,
    highContrast: false,
    endingHistory: [],
    updatedAt: new Date().toISOString()
  };

  await page.evaluate((state) => {
    localStorage.setItem("xingyu-space-save-v1", JSON.stringify(state));
  }, { ...baseState, chapter: 4 });
  await page.reload();
  await page.locator(".evidence-photo img").waitFor({ state: "visible" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator(".optional-evidence").screenshot({
    path: "output/playwright/diary-desktop.png"
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".optional-evidence").screenshot({
    path: "output/playwright/diary-mobile.png"
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.evaluate((state) => {
    localStorage.setItem("xingyu-space-save-v1", JSON.stringify(state));
  }, {
    ...baseState,
    chapter: 5,
    activePage: "migration",
    solvedPuzzleIds: [
      ...baseState.solvedPuzzleIds,
      "ch4-night",
      "ch4-layers",
      "ch4-argument",
      "optional-luqing-diary"
    ],
    collectedArtifactIds: [...baseState.collectedArtifactIds, "luqing-diary"],
    ending: "return",
    endingHistory: ["return"]
  });
  await page.reload();
  await page.locator(".ending-photo img").waitFor({ state: "visible" });

  const failedDesktop = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src"))
  );
  if (failedDesktop.length) {
    throw new Error(`桌面图片加载失败：${failedDesktop.join(",")}`);
  }
  await page.locator(".ending-screen").screenshot({
    path: "output/playwright/ending-desktop.png"
  });

  await page.setViewportSize({ width: 390, height: 844 });
  const failedMobile = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute("src"))
  );
  if (failedMobile.length) {
    throw new Error(`手机图片加载失败：${failedMobile.join(",")}`);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const [actionBox, dockBox] = await Promise.all([
    page.getByRole("button", { name: "返回迁移前快照" }).boundingBox(),
    page.locator(".utility-dock").boundingBox()
  ]);
  if (!actionBox || !dockBox || actionBox.y + actionBox.height > dockBox.y) {
    throw new Error("手机端结局操作被底部工具栏遮挡");
  }
  await page.screenshot({
    path: "output/playwright/ending-mobile.png"
  });
}
