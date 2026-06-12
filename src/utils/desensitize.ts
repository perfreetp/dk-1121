export function desensitizeDream(content: string): { desensitized: string; warnings: string[] } {
  let result = content;
  const warnings: string[] = [];

  const namePatterns = [
    /[A-Z\u4e00-\u9fa5]{2,3}(妈|爸|爷|奶|哥|姐|弟|妹|叔|姨|伯|姑)/g,
    /[A-Z\u4e00-\u9fa5]{2,4}(老师|同学|朋友|同事|经理|主任)/g,
  ];
  
  namePatterns.forEach(pattern => {
    if (pattern.test(result)) {
      warnings.push('检测到可能的人名信息，建议使用"某人"代替');
    }
    result = result.replace(pattern, '某人');
  });

  const locationPatterns = [
    /[A-Z\u4e00-\u9fa5]+(省|市|县|区|镇|村|街|路|道|巷)/g,
    /(北京|上海|广州|深圳|杭州|南京|武汉|成都|重庆|西安)/g,
  ];
  
  locationPatterns.forEach(pattern => {
    if (pattern.test(result)) {
      warnings.push('检测到可能的地名信息，建议使用"某地"代替');
    }
    result = result.replace(pattern, '某地');
  });

  const timePatterns = [
    /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
    /(\d{1,2})月(\d{1,2})日/g,
    /(去年|今年|明年|上周|这周|下周|前天|昨天|今天|明天|后天)/g,
  ];
  
  timePatterns.forEach(pattern => {
    if (pattern.test(result)) {
      warnings.push('检测到具体时间信息，建议模糊处理');
    }
    result = result.replace(pattern, '某时');
  });

  const brandPatterns = [
    /(微信|QQ|微博|抖音|小红书|淘宝|京东|美团|滴滴)/g,
    /(苹果|华为|小米|OPPO|VIVO|三星)/g,
  ];
  
  brandPatterns.forEach(pattern => {
    if (pattern.test(result)) {
      warnings.push('检测到品牌名称，建议使用通用描述代替');
    }
    result = result.replace(pattern, '某个应用');
  });

  return { desensitized: result, warnings };
}

export function validateDreamContent(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (content.trim().length < 20) {
    errors.push('梦境内容至少需要20个字符');
  }

  if (content.trim().length > 500) {
    errors.push('梦境内容不能超过500个字符');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
