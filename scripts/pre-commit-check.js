#!/usr/bin/env node

/**
 * Pre-commit check script
 * Validates the codebase for sensitive data and other issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define sensitive patterns to check for
const sensitivePatterns = [
  /sk_live_/,
  /sk_test_/,
  /pk_live_/,
  /pk_test_/,
  /whsec_/,
  /password\s*[:=]\s*['"][^'"]+['"]/i,
  /secret\s*[:=]\s*['"][^'"]+['"]/i,
  /api_key\s*[:=]\s*['"][^'"]+['"]/i,
  /private_key\s*[:=]\s*['"][^'"]+['"]/i
];

// Files to exclude from checks
const excludePatterns = [
  /\.git\//,
  /node_modules\//,
  /\.env$/,
  /\.env\.backup$/,
  /sensitive-data\.txt$/,
  /package-lock\.json$/,
  /\.log$/,
  /\.min\.js$/,
  /\.map$/,
  /pre-commit-check\.js$/
];

// Directories to exclude
const excludeDirs = [
  'node_modules',
  '.git',
  'certs',
  'dist',
  'build'
];

// Patterns that are safe (test/public keys and debug logs)
const safePatterns = [
  /pk_test_/,
  /pk_live_/,
  /placeholder/,
  /test_/,
  /example_/,
  /console\.log\(.*JWT_SECRET.*/i,
  /console\.log\(.*password.*/i
];

function shouldExcludeFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check exclude patterns
  for (const pattern of excludePatterns) {
    if (pattern.test(relativePath)) {
      return true;
    }
  }
  
  // Check exclude directories
  for (const dir of excludeDirs) {
    if (relativePath.includes(dir)) {
      return true;
    }
  }
  
  return false;
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    lines.forEach((line, index) => {
      sensitivePatterns.forEach(pattern => {
        if (pattern.test(line)) {
          // Check if this is a safe pattern
          const isSafe = safePatterns.some(safePattern => safePattern.test(line));
          if (!isSafe) {
            issues.push({
              line: index + 1,
              content: line.trim(),
              pattern: pattern.toString()
            });
          }
        }
      });
    });
    
    return issues;
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error.message);
    return [];
  }
}

function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDirectory(filePath, fileList);
    } else if (stat.isFile()) {
      if (!shouldExcludeFile(filePath)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

function main() {
  console.log('🔍 Running pre-commit checks...');
  
  const allIssues = [];
  const files = walkDirectory('.');
  
  console.log(`📁 Checking ${files.length} files...`);
  
  files.forEach(file => {
    const issues = checkFile(file);
    if (issues.length > 0) {
      allIssues.push({
        file: path.relative(process.cwd(), file),
        issues
      });
    }
  });
  
  if (allIssues.length > 0) {
    console.error('❌ Pre-commit check failed! Found potential sensitive data:');
    console.error('');
    
    allIssues.forEach(({ file, issues }) => {
      console.error(`📄 ${file}:`);
      issues.forEach(issue => {
        console.error(`   Line ${issue.line}: ${issue.content}`);
      });
      console.error('');
    });
    
    console.error('💡 Please remove or properly secure any sensitive data before committing.');
    console.error('   Consider using environment variables or .env files for sensitive data.');
    process.exit(1);
  }
  
  console.log('✅ Pre-commit check passed! No sensitive data found.');
  process.exit(0);
}

// Run the check
main(); 