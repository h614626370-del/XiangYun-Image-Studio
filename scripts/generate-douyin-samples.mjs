import { mkdir, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { _electron as electron } from "playwright";

const workspaceDir = "D:/ideaWork/image-Studio-workspace/工作文件夹-2026-07-01/抖音宣传20张样图";
const electronPath = "D:/ideaWork/image-Studio-workspace/XiangYun-Image-Studio/node_modules/electron/dist/electron.exe";
const projectRoot = "D:/ideaWork/image-Studio-workspace/XiangYun-Image-Studio";

const samples = [
  {
    name: "01-电商零售-白底商品主图",
    size: "1024x1024",
    quality: "high",
    format: "png",
    prompt: "生成一张电商平台白底商品主图。产品是高硼硅玻璃保温杯，卖点是轻量、防漏、长效保温、通勤便携。纯白背景，柔光棚拍，杯体居中，材质透明真实，杯盖和杯身比例准确，阴影自然，边缘清晰，适合淘宝、京东、拼多多上架主图。",
    avoid: "避免改变产品结构、虚假logo、水印、乱码文字、杂乱背景、过曝反光、产品边缘变形。"
  },
  {
    name: "02-电商零售-商品场景种草图",
    size: "1024x1536",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张小红书风格电商场景种草图。主体是冰感防晒衣，卖点是轻薄透气、UPF50+、夏季通勤和户外防晒。场景为海边木栈道与清爽自然光，服装质感真实，颜色干净，画面有生活方式氛围，主体明确，留出标题文案区域，适合短视频封面和详情页首屏。",
    avoid: "避免衣服结构变形、袖口领口错乱、图案漂移、文字乱码、水印和过度褶皱。"
  },
  {
    name: "03-电商零售-详情页卖点图",
    size: "1024x1536",
    quality: "high",
    format: "png",
    prompt: "为电商详情页生成一张卖点视觉图。商品为无线降噪蓝牙耳机，核心卖点是主动降噪、长续航、通勤会议清晰通话。使用清晰的商业摄影构图，主体占画面60%，周围有干净留白和轻量科技感元素，光影突出金属和磨砂材质，适合后期叠加卖点文字。",
    avoid: "不要生成复杂文字，避免水印、乱码、接口错误、产品比例失真、廉价塑料感。"
  },
  {
    name: "04-美妆护肤-护肤流程套装图",
    size: "1024x1536",
    quality: "high",
    format: "png",
    prompt: "生成一张高端护肤套装流程图。产品为晨间修护护肤套装，包含洁面、精华、乳液、防晒，功效卖点是保湿修护、清爽不粘、敏感肌友好。多件产品排列有层次，背景干净高级，可加入水滴、植物、实验室玻璃质感，留出步骤说明区域，适合品牌详情页和短视频首帧。",
    avoid: "避免功效夸大、瓶身文字乱码、包装变形、医疗暗示、杂乱道具。"
  },
  {
    name: "05-珠宝婚戒-婚戒对戒海报",
    size: "1024x1536",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张适合抖音发布的竖版珠宝婚戒宣传海报底图。主题为七夕限定铂金对戒礼盒，主体是一对铂金钻石对戒，放在香槟金礼盒和丝绸内衬中。主体位于中下部，上方保留干净大面积标题留白，风格为高端珠宝商业摄影，柔和高光，钻石清晰，丝绸、花瓣、浅香槟色花艺营造浪漫礼赠氛围。",
    avoid: "避免横版构图、戒圈变形、钻石结构错误、过曝反光、俗艳背景、虚假品牌标识、文字乱码、水印。"
  },
  {
    name: "06-餐饮茶饮-菜品主图",
    size: "1024x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张餐饮菜品主图。菜品为藤椒鸡腿饭，卖点是现炒热气、鸡腿多汁、青花椒香气、外卖高点击率。食材新鲜，米饭颗粒清晰，鸡腿有诱人油亮但不过腻，背景为干净餐桌和柔和自然光，适合菜单、外卖平台和团购封面。",
    avoid: "避免颜色异常、食物不可食用质感、餐具脏乱、过度油腻、人物手部和乱码文字。"
  },
  {
    name: "07-短剧影视-竖版短剧封面",
    size: "1024x1536",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张短剧竖版封面。题材为都市逆袭爽剧，核心冲突是普通女孩被豪门误解后强势回归。画面包含女主和压迫感背景人物，女主表情坚定，关系张力明确，电影级布光，背景为都市夜景和豪门大厅，构图适合手机封面，上方留出标题区域，写实戏剧化，高点击率。",
    avoid: "避免卡通感、五官崩坏、手部畸形、文字乱码、人物过多、低俗血腥。"
  },
  {
    name: "08-短剧影视-角色定妆照",
    size: "1024x1536",
    quality: "high",
    format: "png",
    prompt: "生成一张短剧角色定妆照。角色为冷静克制的年轻商业律师，身份设定为外表温和但擅长反击的女主。人物半身，服装为高级灰西装，发型干净，妆容自然，表情有故事感，背景简洁电影棚拍，方便后续统一角色形象，适合人物宣发图。",
    avoid: "避免夸张滤镜、脸部崩坏、服装细节混乱、手部畸形、真实明星脸。"
  },
  {
    name: "09-自媒体内容-小红书封面底图",
    size: "1024x1536",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张小红书封面底图。主题是普通人如何用AI做商用图片，面向电商运营和自媒体新人。画面干净、高级、有生活方式氛围，主体可以是桌面上的笔记本电脑、生成图片预览、咖啡和便签，左侧或上方保留大面积文字留白，适合后期叠加标题。",
    avoid: "不要生成具体文字、二维码、水印或复杂小元素。"
  },
  {
    name: "10-自媒体内容-B站横版封面",
    size: "1536x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张B站视频横版封面底图。主题为AI商用图片生产工作流，风格专业但有冲击力。画面包含桌面电脑界面、图片生成结果墙、提示词卡片和清晰视觉中心，左右构图平衡，右侧预留标题区，色彩鲜明但不廉价，适合科技教程和工具测评视频。",
    avoid: "不要直接生成标题文字、避免乱码、真实品牌侵权、界面内容拥挤。"
  },
  {
    name: "11-品牌广告-品牌KV主视觉",
    size: "1536x1024",
    quality: "high",
    format: "png",
    prompt: "生成一张品牌广告KV主视觉。品牌为新锐智能水杯品牌，主题为夏季轻量通勤，核心信息为一杯水连接办公室、健身房和城市通勤。画面高级、有明确视觉锤，产品突出，构图适合线上线下传播，保留标题和logo排版区域，风格现代、清爽、可信。",
    avoid: "不要生成未经确认的品牌标识或乱码文字，避免产品结构错误和过度复杂背景。"
  },
  {
    name: "12-品牌广告-节日营销海报",
    size: "1024x1536",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张节日营销海报底图。节日为618大促，品牌或产品为家用咖啡机，核心活动为限时礼赠和套装优惠。画面有活动氛围但不过度俗艳，咖啡机主体明确，加入咖啡豆、奶泡和礼盒彩带，色彩高级，保留主标题、优惠信息和logo区域。",
    avoid: "不要直接生成促销文字、虚假logo、二维码、水印或低俗符号。"
  },
  {
    name: "13-家装建筑-室内设计效果图",
    size: "1536x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张室内设计效果图。空间为35平方米城市公寓客厅，风格为现代原木极简，色彩为暖白、浅木色和少量黑色线条。画面真实、整洁、比例准确，家具布局合理，光线自然，材质包括木材、织物、石材和金属细节，适合装修方案展示。",
    avoid: "避免透视错误、家具悬浮、空间比例异常、过度豪宅化和杂乱物品。"
  },
  {
    name: "14-文旅酒店-酒店民宿宣传图",
    size: "1536x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张酒店民宿宣传图。空间为山景民宿观景房，卖点为落地窗、清晨山景、安静度假、周末轻旅行。画面真实、高级、舒适，突出房间、窗景、床品和自然光，光线柔和，适合OTA平台、社媒宣传和短视频封面。",
    avoid: "避免空间脏乱、过度广角畸变、家具变形、虚假地标、人物隐私。"
  },
  {
    name: "15-工业B2B-工业设备宣传图",
    size: "1536x1024",
    quality: "high",
    format: "png",
    prompt: "生成一张工业设备宣传图。设备为智能激光切割机，卖点为高精度、自动送料、稳定量产和售后服务。画面专业、洁净、可信，设备结构清晰，金属材质真实，背景为现代工厂或实验室，适合官网、产品手册和招商展会。",
    avoid: "避免设备结构错乱、危险操作、过度科幻、工人防护不当、文字乱码。"
  },
  {
    name: "16-教育知识-课程封面",
    size: "1536x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张在线课程封面底图。课程主题为AI商用图片实战课，目标学员为电商运营、自媒体创作者和设计新人。画面专业、可信、现代，包含学习场景、电脑、提示词卡片、图像预览和轻量抽象元素，留出标题和讲师信息区域。",
    avoid: "不要生成具体文字、虚假证书、收益承诺、二维码、水印。"
  },
  {
    name: "17-人物图像-社交头像写真",
    size: "1024x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张高质感社交头像写真。人物为年轻AI产品顾问，身份气质为专业、亲和、可信，风格为现代商务轻写真。半身或近景构图，眼神自然，脸部清晰，背景干净有层次，小尺寸也有识别度，适合微信、小红书、抖音和个人主页头像。",
    avoid: "避免真实明星肖像、过度磨皮、五官崩坏、手部畸形、低俗暴露、文字水印。"
  },
  {
    name: "18-二次元头像-日系清透头像",
    size: "1024x1024",
    quality: "high",
    format: "png",
    prompt: "生成一张日系清透二次元头像。角色为年轻AI绘图助手，性格为聪明、温柔、可靠，画风清爽精致，色彩为浅蓝、白色和少量紫色。头像构图清晰，五官精致，发型、服装和配色统一，背景简洁，适合社交头像、账号IP和虚拟形象。",
    avoid: "避免盗用知名动漫角色、真实明星转绘、五官崩坏、发型漂移、低清晰度、文字水印。"
  },
  {
    name: "19-虚拟IP-虚拟主播头像",
    size: "1024x1024",
    quality: "high",
    format: "png",
    prompt: "生成一张虚拟主播头像。角色为AI商图实验室主持人，人设关键词为理性、活泼、懂商业设计，风格现代二次元，色彩为科技蓝、白色和少量霓虹紫。头像精致、轮廓清楚、表情有亲和力，适合直播间、社交账号和虚拟主播主页。",
    avoid: "避免复刻知名VTuber或动漫IP、真实明星脸、五官崩坏、装饰过度遮挡脸部。"
  },
  {
    name: "20-直播电商-直播间货盘背景",
    size: "1536x1024",
    quality: "high",
    format: "jpeg",
    prompt: "生成一张直播电商货盘背景。品类为家居清洁用品，卖点为高性价比、组合套装、家庭囤货和限时活动。画面包含展示台、货架、柔光、品牌色装饰和主播站位，商品陈列有秩序，适合直播间布景、短视频封面和带货预热视频。",
    avoid: "不要生成价格文字、虚假二维码、过度拥挤、人脸崩坏、低清晰度。"
  }
];

function extension(format) {
  return format === "jpeg" ? "jpg" : format;
}

async function main() {
  await mkdir(workspaceDir, { recursive: true });
  const app = await electron.launch({
    executablePath: electronPath,
    cwd: projectRoot,
    args: ["."]
  });
  const window = await app.firstWindow();
  await window.waitForLoadState("domcontentloaded");

  const results = [];
  try {
    for (const [index, sample] of samples.entries()) {
      const startedAt = Date.now();
      console.log(`[${index + 1}/${samples.length}] 开始生成 ${sample.name}`);
      const response = await window.evaluate(async (payload) => {
        const bridge = window.xiangyun;
        if (!bridge?.generateImage || !bridge?.saveImage) {
          throw new Error("向云Pro桥接未加载");
        }
        const result = await bridge.generateImage({
          prompt: `${payload.prompt}\n避免内容：${payload.avoid}`,
          size: payload.size,
          quality: payload.quality,
          output_format: payload.format,
          background: "auto"
        });
        const first = result.data?.find((item) => item.b64_json || item.url);
        if (!first) {
          throw new Error("接口没有返回图片数据");
        }
        const dataUrl = first.b64_json ? `data:image/${payload.format};base64,${first.b64_json}` : first.url;
        const saved = await bridge.saveImage({ dataUrl, name: payload.name });
        return {
          savedPath: saved.path,
          revisedPrompt: first.revised_prompt,
          hasBase64: Boolean(first.b64_json)
        };
      }, sample);
      const targetPath = path.join(workspaceDir, `${sample.name}.${extension(sample.format)}`);
      await copyFile(response.savedPath, targetPath);
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      const row = { ...sample, savedPath: response.savedPath, targetPath, revisedPrompt: response.revisedPrompt ?? "", seconds };
      results.push(row);
      console.log(`[${index + 1}/${samples.length}] 完成 ${sample.name} -> ${targetPath} (${seconds}s)`);
    }
  } finally {
    await app.close().catch(() => {});
  }

  const report = [
    "# 抖音宣传20张样图生成记录",
    "",
    `生成时间: ${new Date().toLocaleString("zh-CN")}`,
    "",
    "| 序号 | 样图 | 尺寸 | 质量 | 格式 | 耗时 | 文件 |",
    "| ---: | --- | --- | --- | --- | ---: | --- |",
    ...results.map((item, index) => `| ${index + 1} | ${item.name} | ${item.size} | ${item.quality} | ${item.format} | ${item.seconds}s | ${path.basename(item.targetPath)} |`),
    "",
    "## 提示词",
    "",
    ...results.flatMap((item, index) => [
      `### ${index + 1}. ${item.name}`,
      "",
      `尺寸: ${item.size}；质量: ${item.quality}；格式: ${item.format}`,
      "",
      `提示词: ${item.prompt}`,
      "",
      `避免: ${item.avoid}`,
      "",
      item.revisedPrompt ? `模型优化提示词: ${item.revisedPrompt}` : "",
      ""
    ])
  ].join("\n");
  await writeFile(path.join(workspaceDir, "生成记录.md"), report, "utf-8");
  console.log(`全部完成，共 ${results.length} 张。目录：${workspaceDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
