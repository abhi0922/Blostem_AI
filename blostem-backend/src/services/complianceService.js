const complianceRules = [
  {
    id: 'misleading-claims',
    name: 'Misleading Claims',
    pattern: /(guaranteed|100%|promise|ensure)/i,
    severity: 'high',
    message: 'Contains potentially misleading claims. Avoid absolute guarantees.'
  },
  {
    id: 'financial-promises',
    name: 'Financial Promises',
    pattern: /(make you money|guaranteed return|profit|earnings|income)/i,
    severity: 'high',
    message: 'Contains financial promises that could be considered misleading.'
  },
  {
    id: 'sensitive-language',
    name: 'Sensitive Language',
    pattern: /(urgent|immediate|act now|limited time|expire)/i,
    severity: 'medium',
    message: 'Uses pressure tactics that may reduce engagement.'
  },
  {
    id: 'spam-triggers',
    name: 'Spam Triggers',
    pattern: /(free|winner|click here|buy now|discount)/i,
    severity: 'medium',
    message: 'Contains words that may trigger spam filters.'
  },
  {
    id: 'gdpr-concern',
    name: 'GDPR Compliance',
    pattern: /(unsubscribe|opt-out|privacy|consent)/i,
    severity: 'low',
    message: 'Consider adding proper GDPR compliance elements.'
  }
];

const checkCompliance = (content) => {
  const issues = [];
  let riskScore = 0;
  
  for (const rule of complianceRules) {
    const matches = content.match(rule.pattern);
    if (matches) {
      issues.push({
        ruleId: rule.id,
        name: rule.name,
        severity: rule.severity,
        message: rule.message,
        matches: matches.length,
        found: matches[0]
      });
      
      if (rule.severity === 'high') riskScore += 30;
      else if (rule.severity === 'medium') riskScore += 15;
      else riskScore += 5;
    }
  }
  
  const passed = riskScore < 40;
  const status = passed ? 'PASS' : riskScore < 70 ? 'WARNING' : 'FAIL';
  
  return {
    passed,
    status,
    riskScore: Math.min(riskScore, 100),
    totalIssues: issues.length,
    issues,
    recommendations: passed ? [] : getRecommendations(issues),
    checkedAt: new Date().toISOString()
  };
};

const getRecommendations = (issues) => {
  const recommendations = [];
  
  if (issues.some(i => i.ruleId === 'misleading-claims')) {
    recommendations.push('Replace absolute guarantees with realistic outcomes');
  }
  if (issues.some(i => i.ruleId === 'financial-promises')) {
    recommendations.push('Remove specific financial claims, use case studies instead');
  }
  if (issues.some(i => i.ruleId === 'sensitive-language')) {
    recommendations.push('Remove urgency language, focus on value proposition');
  }
  if (issues.some(i => i.ruleId === 'spam-triggers')) {
    recommendations.push('Use softer language, avoid spam trigger words');
  }
  if (issues.some(i => i.ruleId === 'gdpr-concern')) {
    recommendations.push('Ensure proper unsubscribe link and privacy notice');
  }
  
  return recommendations;
};

module.exports = {
  checkCompliance
};