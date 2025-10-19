/**
 * Input Sanitization Utility
 * Prevents XSS attacks by sanitizing user input
 */

const createDOMPurify = require('isomorphic-dompurify');

class SanitizationService {
  /**
   * Sanitize HTML content to prevent XSS
   * Removes dangerous tags and attributes
   */
  static sanitizeHTML(content) {
    if (!content || typeof content !== 'string') {
      return '';
    }

    // Configure DOMPurify with strict settings
    const clean = createDOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });

    return clean;
  }

  /**
   * Sanitize plain text (for titles, etc.)
   * Removes all HTML tags and dangerous characters
   */
  static sanitizeText(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // Remove HTML tags
    let clean = text.replace(/<[^>]*>/g, '');
    
    // Remove special characters that could be dangerous
    clean = clean.replace(/[<>\"\']/g, '');
    
    // Trim whitespace
    clean = clean.trim();

    return clean;
  }

  /**
   * Validate and sanitize forum post data
   */
  static sanitizePostData(data) {
    return {
      title: this.sanitizeText(data.title),
      content: this.sanitizeHTML(data.content),
    };
  }

  /**
   * Validate and sanitize comment data
   */
  static sanitizeCommentData(data) {
    return {
      content: this.sanitizeHTML(data.content),
    };
  }

  /**
   * Escape SQL special characters (additional layer)
   * Note: We use parameterized queries, but this is extra security
   */
  static escapeSQLString(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char;
        default:
          return char;
      }
    });
  }

  /**
   * Validate string length
   */
  static validateLength(str, min, max) {
    if (!str || typeof str !== 'string') {
      return false;
    }
    
    const length = str.trim().length;
    return length >= min && length <= max;
  }

  /**
   * Check for spam patterns
   */
  static isSpam(content) {
    const spamPatterns = [
      /viagra/i,
      /cialis/i,
      /casino/i,
      /\b(buy now|click here)\b/i,
      /(https?:\/\/){3,}/i, // Multiple URLs
    ];

    return spamPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Rate limiting key generation
   */
  static getRateLimitKey(userId, action) {
    return `rate_limit:${action}:${userId}`;
  }
}

module.exports = SanitizationService;