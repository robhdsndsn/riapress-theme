const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1600, height: 1000 }
  });

  const page = await browser.newPage();

  // Listen to console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({ type: msg.type(), text });
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[${msg.type().toUpperCase()}]`, text);
    }
  });

  try {
    console.log('Navigating to editor...');
    await page.goto('http://localhost:8882/wp-admin/post.php?post=5&action=edit', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    console.log('Waiting for editor to load...');
    await page.waitForFunction(() => {
      return typeof wp !== 'undefined' &&
             typeof wp.data !== 'undefined' &&
             typeof wp.blocks !== 'undefined';
    }, { timeout: 30000 });

    await page.waitForTimeout(3000);

    console.log('\n=== COMPREHENSIVE BLOCK TEST WITH FULL SETTINGS ===\n');

    const results = await page.evaluate(async () => {
      const { select, dispatch } = wp.data;
      const { createBlock } = wp.blocks;

      // Clear existing blocks
      const existingBlocks = select('core/block-editor').getBlocks();
      const clientIds = existingBlocks.map(block => block.clientId);
      dispatch('core/block-editor').removeBlocks(clientIds);

      await new Promise(resolve => setTimeout(resolve, 500));

      const results = [];
      const errors = [];

      // Define ALL 44 blocks with FULL settings
      const blocksToTest = [
        // 1. BUTTON
        {
          name: 'ria/button',
          attributes: {
            text: 'Click Me Button',
            variant: 'primary',
            size: 'large',
            url: 'https://example.com',
            openInNewTab: true,
            customBackgroundColor: '#0066cc',
            customTextColor: '#ffffff',
            customPadding: '16px 32px'
          }
        },

        // 2. HEADING
        {
          name: 'ria/heading',
          attributes: {
            content: 'Comprehensive Block Test - All Settings',
            level: 1,
            textAlign: 'center',
            variant: 'primary',
            animationType: 'fadeInDown',
            animationDuration: 800,
            animationDelay: 0
          }
        },

        // 3. BADGE
        {
          name: 'ria/badge',
          attributes: {
            text: 'NEW FEATURE',
            variant: 'success',
            size: 'large',
            customBackgroundColor: '#10b981',
            customTextColor: '#ffffff',
            animationType: 'pulse',
            animationDuration: 1000
          }
        },

        // 4. SEPARATOR
        {
          name: 'ria/separator',
          attributes: {
            style: 'solid',
            width: 100,
            height: 2,
            color: '#e5e7eb',
            margin: 24,
            animationType: 'fadeIn',
            animationDuration: 600
          }
        },

        // 5. ICON
        {
          name: 'ria/icon',
          attributes: {
            icon: 'star',
            size: 48,
            color: '#fbbf24',
            backgroundColor: '#fef3c7',
            padding: 16,
            borderRadius: 8,
            animationType: 'rotateIn',
            animationDuration: 800
          }
        },

        // 6. IMAGE
        {
          name: 'ria/image',
          attributes: {
            url: 'https://picsum.photos/800/600',
            alt: 'Test image with full settings',
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: 12,
            boxShadow: 'large',
            animationType: 'zoomIn',
            animationDuration: 1000
          }
        },

        // 7. TEXT
        {
          name: 'ria/text',
          attributes: {
            content: 'This is a test paragraph with custom styling, padding, and animations applied to verify all settings work correctly.',
            fontSize: 'medium',
            textAlign: 'left',
            textColor: '#374151',
            padding: 24,
            animationType: 'fadeInUp',
            animationDuration: 600
          }
        },

        // 8. ICON LIST
        {
          name: 'ria/icon-list',
          attributes: {
            items: [
              { text: 'Feature One', icon: 'check' },
              { text: 'Feature Two', icon: 'check' },
              { text: 'Feature Three', icon: 'check' }
            ],
            iconSize: 20,
            iconColor: '#10b981',
            spacing: 12,
            animationType: 'fadeInLeft',
            animationDuration: 600
          }
        },

        // 9. SPACER
        {
          name: 'ria/spacer',
          attributes: {
            height: 60,
            showDivider: true,
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: '#d1d5db',
            animationType: 'fadeIn'
          }
        },

        // 10. DIVIDER
        {
          name: 'ria/divider',
          attributes: {
            style: 'gradient',
            height: 3,
            width: 80,
            color: '#8b5cf6',
            marginTop: 32,
            marginBottom: 32,
            animationType: 'slideInLeft',
            animationDuration: 800
          }
        },

        // 11. PROGRESS BAR (Already tested but with MORE settings)
        {
          name: 'ria/progress-bar',
          attributes: {
            bars: [
              { label: 'Project Completion', value: 85, showPercentage: true },
              { label: 'Quality Score', value: 92, showPercentage: true },
              { label: 'Performance', value: 78, showPercentage: true }
            ],
            variant: 'success',
            layout: 'stacked',
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#10b981',
            boxShadow: 'medium',
            animationEnabled: true,
            animationType: 'fadeInUp',
            animationDuration: 1000,
            customBackgroundColor: '#f3f4f6',
            customBarColor: '#10b981',
            customTextColor: '#111827'
          }
        },

        // 12. SUBTITLE
        {
          name: 'ria/subtitle',
          attributes: {
            content: 'Testing Subtitle Block',
            fontSize: 'large',
            textAlign: 'center',
            textColor: '#6b7280',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#e5e7eb',
            padding: 16,
            animationType: 'fadeIn',
            animationDuration: 600
          }
        },

        // 13. SHAPE
        {
          name: 'ria/shape',
          attributes: {
            shape: 'circle',
            size: 100,
            color: '#ec4899',
            opacity: 0.8,
            rotation: 45,
            animationType: 'rotateIn',
            animationDuration: 1000
          }
        },

        // 14. CARD (with MORE settings)
        {
          name: 'ria/card',
          attributes: {
            heading: 'Comprehensive Card Test',
            content: 'Testing card with full settings: variant, colors, border, shadow, padding, and hover effects.',
            variant: 'primary',
            layout: 'vertical',
            imagePosition: 'top',
            imageUrl: 'https://picsum.photos/400/300',
            padding: 32,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: 16,
            boxShadow: 'xlarge',
            hoverShadow: '2xlarge',
            customBackgroundColor: '#ffffff',
            customTextColor: '#111827',
            customHeadingColor: '#1f2937'
          }
        },

        // 15. IMAGE BOX
        {
          name: 'ria/image-box',
          attributes: {
            imageUrl: 'https://picsum.photos/600/400',
            heading: 'Image Box Test',
            content: 'Testing image box with overlay and animations',
            variant: 'secondary',
            overlayOpacity: 0.6,
            padding: 24,
            customBackgroundColor: 'rgba(59, 130, 246, 0.9)',
            customTextColor: '#ffffff',
            animationType: 'zoomIn',
            animationDuration: 800
          }
        },

        // 16. ICON BOX
        {
          name: 'ria/icon-box',
          attributes: {
            icon: 'lightbulb',
            heading: 'Icon Box Feature',
            content: 'Testing icon box with full styling options',
            variant: 'accent',
            iconSize: 64,
            iconPosition: 'top',
            padding: 32,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#8b5cf6',
            borderRadius: 12,
            boxShadow: 'large',
            customBackgroundColor: '#f5f3ff',
            customIconColor: '#8b5cf6',
            customTextColor: '#4c1d95',
            animationType: 'fadeInUp',
            animationDuration: 600
          }
        },

        // 17. NUMBER BOX
        {
          name: 'ria/number-box',
          attributes: {
            number: '01',
            heading: 'First Step',
            content: 'Testing number box with styling',
            variant: 'primary',
            numberSize: 72,
            padding: 24,
            customBackgroundColor: '#dbeafe',
            customNumberColor: '#1e40af',
            customTextColor: '#1e3a8a',
            animationType: 'bounceIn',
            animationDuration: 800
          }
        },

        // 18. NOTIFICATION (Alert)
        {
          name: 'ria/notification',
          attributes: {
            message: 'This is a comprehensive test of the notification block with all settings enabled.',
            variant: 'info',
            icon: 'info',
            dismissible: true,
            showIcon: true,
            customBackgroundColor: '#dbeafe',
            customTextColor: '#1e40af',
            customIconColor: '#3b82f6',
            animationType: 'slideInRight',
            animationDuration: 600
          }
        },

        // 19. ACCORDION (with MORE settings)
        {
          name: 'ria/accordion',
          attributes: {
            layout: 'default',
            accordionType: 'multiple',
            variant: 'primary',
            titleSize: 18,
            iconSize: 20,
            titlePadding: 16,
            contentPadding: 20,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: 8,
            boxShadow: 'medium',
            animationEnabled: true,
            animationType: 'fadeIn',
            customTitleBackground: '#eff6ff',
            customContentBackground: '#ffffff',
            customTitleColor: '#1e40af',
            customContentColor: '#374151'
          },
          innerBlocks: [
            {
              name: 'ria/accordion-item',
              attributes: {
                title: 'Accordion Item 1',
                content: 'First accordion item content with full styling',
                isOpen: true,
                variant: 'primary'
              }
            },
            {
              name: 'ria/accordion-item',
              attributes: {
                title: 'Accordion Item 2',
                content: 'Second accordion item content',
                isOpen: false,
                variant: 'primary'
              }
            }
          ]
        },

        // 20. COUNTDOWN
        {
          name: 'ria/countdown',
          attributes: {
            targetDate: '2025-12-31T23:59:59',
            showDays: true,
            showHours: true,
            showMinutes: true,
            showSeconds: true,
            layout: 'horizontal',
            size: 'large',
            padding: 24
          }
        },

        // 21. CONTAINER
        {
          name: 'ria/container',
          attributes: {
            maxWidth: 1200,
            padding: 48,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#e5e7eb',
            borderRadius: 16,
            boxShadow: 'large',
            backgroundColor: '#f9fafb',
            animationType: 'fadeIn',
            animationDuration: 600
          }
        },

        // 22. PERSON PROFILE (with MORE settings)
        {
          name: 'ria/person-profile',
          attributes: {
            name: 'Dr. Jane Smith',
            title: 'Chief Technology Officer',
            bio: 'Experienced technology leader with expertise in AI, cloud computing, and digital transformation. PhD in Computer Science.',
            email: 'jane.smith@example.com',
            phone: '(555) 987-6543',
            imageUrl: 'https://i.pravatar.cc/300?img=5',
            variant: 'accent',
            layout: 'horizontal',
            imagePosition: 'left',
            imageSize: 150,
            showSocial: true,
            socialLinks: {
              linkedin: 'https://linkedin.com/in/janesmith',
              twitter: 'https://twitter.com/janesmith'
            },
            padding: 32,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#8b5cf6',
            borderRadius: 12,
            boxShadow: 'xlarge',
            customBackgroundColor: '#faf5ff',
            customTextColor: '#581c87',
            animationType: 'fadeInLeft',
            animationDuration: 800
          }
        },

        // 23. RESOURCE CARD (with MORE settings)
        {
          name: 'ria/resource-card',
          attributes: {
            title: 'Comprehensive Guide to Testing',
            description: 'A detailed resource card with all settings configured including colors, borders, shadows, and animations.',
            resourceType: 'guide',
            fileSize: '2.5 MB',
            downloadUrl: 'https://example.com/download',
            imageUrl: 'https://picsum.photos/400/250',
            variant: 'success',
            showIcon: true,
            showDownload: true,
            padding: 24,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#10b981',
            borderRadius: 12,
            boxShadow: 'large',
            hoverShadow: 'xlarge',
            customBackgroundColor: '#f0fdf4',
            customTextColor: '#065f46',
            animationType: 'fadeInUp',
            animationDuration: 600
          }
        },

        // 24. EVENT CARD (with ALL settings)
        {
          name: 'ria/event-card',
          attributes: {
            title: 'Annual Tech Conference 2025',
            description: 'Join us for a comprehensive technology conference featuring keynotes, workshops, and networking.',
            eventDate: '2025-12-15',
            eventTime: '09:00 AM',
            location: 'Toronto Convention Center',
            locationAddress: '255 Front St W, Toronto, ON',
            status: 'upcoming',
            registrationUrl: 'https://example.com/register',
            imageUrl: 'https://picsum.photos/600/400',
            variant: 'primary',
            showBadge: true,
            showLocation: true,
            showTime: true,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: 16,
            boxShadow: 'xlarge',
            hoverShadow: '2xlarge',
            customBackgroundColor: '#ffffff',
            customTextColor: '#111827',
            customBadgeColor: '#3b82f6',
            animationType: 'zoomIn',
            animationDuration: 800
          }
        },

        // 25. STATS GROUP (with ALL settings)
        {
          name: 'ria/stats-group',
          attributes: {
            columns: 3,
            gap: 32,
            layout: 'cards',
            variant: 'accent',
            padding: 24,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: '#8b5cf6',
            borderRadius: 12,
            boxShadow: 'medium',
            customBackgroundColor: '#faf5ff',
            animationEnabled: true,
            animationType: 'fadeIn',
            staggerAnimation: true,
            staggerDelay: 100
          },
          innerBlocks: [
            {
              name: 'ria/stat',
              attributes: {
                value: '10,000+',
                label: 'Users',
                icon: 'users',
                variant: 'accent'
              }
            },
            {
              name: 'ria/stat',
              attributes: {
                value: '95%',
                label: 'Satisfaction',
                icon: 'star',
                variant: 'accent'
              }
            },
            {
              name: 'ria/stat',
              attributes: {
                value: '24/7',
                label: 'Support',
                icon: 'headphones',
                variant: 'accent'
              }
            }
          ]
        },

        // 26. QUOTE (with ALL settings)
        {
          name: 'ria/quote',
          attributes: {
            quote: 'Testing is not just about finding bugs; it\'s about ensuring quality, reliability, and user satisfaction at every level.',
            author: 'Quality Assurance Expert',
            title: 'Senior QA Engineer',
            variant: 'secondary',
            layout: 'modern',
            showQuoteIcon: true,
            iconSize: 48,
            padding: 32,
            borderWidth: 4,
            borderStyle: 'solid',
            borderColor: '#06b6d4',
            borderRadius: 12,
            boxShadow: 'large',
            customBackgroundColor: '#ecfeff',
            customQuoteColor: '#164e63',
            customAuthorColor: '#0e7490',
            animationType: 'fadeInRight',
            animationDuration: 800
          }
        },

        // 27. LINK LIST (with ALL settings)
        {
          name: 'ria/link-list',
          attributes: {
            links: [
              { url: 'https://example.com/docs', text: 'Documentation', icon: 'book', description: 'Complete guides and references' },
              { url: 'https://example.com/api', text: 'API Reference', icon: 'code', description: 'Technical API documentation' },
              { url: 'https://example.com/tutorials', text: 'Tutorials', icon: 'video', description: 'Step-by-step tutorials' },
              { url: 'https://example.com/support', text: 'Support', icon: 'help-circle', description: 'Get help from our team' }
            ],
            layout: 'vertical',
            variant: 'primary',
            linkStyle: 'button',
            linkSize: 'medium',
            showIcons: true,
            showDescriptions: true,
            iconPosition: 'left',
            iconSize: 24,
            spacing: 16,
            dividerStyle: 'solid',
            padding: 24,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: 12,
            boxShadow: 'medium',
            customBackgroundColor: '#eff6ff',
            customLinkColor: '#1e40af',
            customIconColor: '#3b82f6',
            animationEnabled: true,
            animationType: 'fadeInUp',
            staggerAnimation: true,
            staggerDelay: 100
          }
        },

        // 28. CONTACT INFO (with ALL settings)
        {
          name: 'ria/contact-info',
          attributes: {
            phone: '1-800-555-0199',
            email: 'contact@example.com',
            address: '123 Main Street, Toronto, ON M5H 2N2',
            website: 'https://www.example.com',
            variant: 'success',
            layout: 'vertical',
            alignment: 'left',
            fontSize: 'medium',
            iconStyle: 'solid',
            iconPosition: 'left',
            iconSize: 24,
            iconColor: '#10b981',
            showIcons: true,
            spacing: 16,
            socialIcons: {
              facebook: 'https://facebook.com/example',
              twitter: 'https://twitter.com/example',
              linkedin: 'https://linkedin.com/company/example',
              instagram: 'https://instagram.com/example'
            },
            showSocial: true,
            socialIconSize: 32,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#10b981',
            borderRadius: 12,
            boxShadow: 'medium',
            customBackgroundColor: '#f0fdf4',
            customTextColor: '#065f46',
            customLinkColor: '#059669',
            animationType: 'fadeInLeft',
            animationDuration: 600
          }
        },

        // 29. HEADER
        {
          name: 'ria/header',
          attributes: {
            siteName: 'RIA Test Site',
            tagline: 'Comprehensive Testing Platform',
            showLogo: true,
            showNavigation: true,
            sticky: true,
            padding: 20,
            animationType: 'slideInDown',
            animationDuration: 600
          }
        },

        // 30. HERO
        {
          name: 'ria/hero',
          attributes: {
            heading: 'Welcome to Comprehensive Testing',
            subheading: 'Testing all blocks with full settings configuration',
            backgroundImage: 'https://picsum.photos/1920/800',
            overlayOpacity: 0.5,
            height: 600,
            contentAlignment: 'center',
            padding: 80,
            animationType: 'fadeIn',
            animationDuration: 1000
          }
        },

        // 31. FEATURE GRID
        {
          name: 'ria/feature-grid',
          attributes: {
            columns: 3,
            gap: 32,
            layout: 'grid',
            padding: 24
          }
        },

        // 32. CTA SECTION
        {
          name: 'ria/cta-section',
          attributes: {
            heading: 'Get Started Today',
            description: 'Join thousands of satisfied users and start testing now',
            buttonText: 'Sign Up Free',
            buttonUrl: 'https://example.com/signup',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            borderWidth: 0,
            borderRadius: 16,
            boxShadow: 'xlarge',
            animationType: 'zoomIn',
            animationDuration: 800
          }
        },

        // 33. TESTIMONIAL SLIDER
        {
          name: 'ria/testimonial-slider',
          attributes: {
            testimonials: [
              {
                quote: 'Amazing product! Exceeded all expectations.',
                author: 'John Client',
                title: 'CEO, Tech Corp',
                image: 'https://i.pravatar.cc/150?img=12'
              }
            ],
            autoplay: true,
            autoplaySpeed: 5000,
            showDots: true,
            showArrows: true,
            animationType: 'fadeIn'
          }
        },

        // 34. TEAM SECTION
        {
          name: 'ria/team-section',
          attributes: {
            heading: 'Our Team',
            columns: 4,
            gap: 24,
            layout: 'grid',
            animationType: 'fadeInUp',
            animationDuration: 600
          }
        },

        // 35. FOOTER
        {
          name: 'ria/footer',
          attributes: {
            copyrightText: '© 2025 RIA Test. All rights reserved.',
            showSocial: true,
            columns: 4,
            backgroundColor: '#1f2937',
            textColor: '#f9fafb',
            animationType: 'fadeIn'
          }
        },

        // 36. QUERY LOOP
        {
          name: 'ria/query-loop',
          attributes: {
            postType: 'post',
            postsPerPage: 6,
            columns: 3,
            gap: 24,
            showFeaturedImage: true,
            showExcerpt: true,
            padding: 24,
            animationType: 'fadeInUp'
          }
        },

        // 37. MODAL
        {
          name: 'ria/modal',
          attributes: {
            title: 'Modal Popup Test',
            content: 'Testing modal with all settings',
            variant: 'primary',
            size: 'medium',
            showCloseButton: true,
            closeOnOverlay: true,
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: '#3b82f6',
            borderRadius: 12,
            boxShadow: '2xlarge',
            customBackgroundColor: '#ffffff',
            customTextColor: '#111827',
            animationType: 'zoomIn',
            animationDuration: 300
          }
        },

        // 38. TOOLTIP
        {
          name: 'ria/tooltip',
          attributes: {
            text: 'Hover for tooltip',
            tooltipContent: 'This is a comprehensive tooltip test with all settings configured',
            variant: 'dark',
            position: 'top',
            trigger: 'hover',
            padding: 12,
            customBackgroundColor: '#111827',
            customTextColor: '#f9fafb'
          }
        },

        // 39. POPOVER
        {
          name: 'ria/popover',
          attributes: {
            triggerText: 'Click for popover',
            content: 'Popover content with full styling',
            variant: 'primary',
            position: 'bottom',
            trigger: 'click',
            customBackgroundColor: '#eff6ff',
            customTextColor: '#1e40af'
          }
        },

        // 40. SOCIAL LINK
        {
          name: 'ria/social-link',
          attributes: {
            platform: 'twitter',
            url: 'https://twitter.com/example',
            size: 32,
            style: 'filled',
            color: '#1da1f2',
            padding: 8,
            animationType: 'bounceIn'
          }
        }
      ];

      // Test each block
      for (const blockData of blocksToTest) {
        try {
          let block;

          // Create block with inner blocks if specified
          if (blockData.innerBlocks) {
            const innerBlocks = blockData.innerBlocks.map(inner =>
              createBlock(inner.name, inner.attributes)
            );
            block = createBlock(blockData.name, blockData.attributes, innerBlocks);
          } else {
            block = createBlock(blockData.name, blockData.attributes);
          }

          // Insert block
          dispatch('core/block-editor').insertBlocks(block);

          // Wait for block to render
          await new Promise(resolve => setTimeout(resolve, 300));

          results.push({
            block: blockData.name,
            status: 'SUCCESS',
            settingsApplied: Object.keys(blockData.attributes).length
          });

          console.log(`✅ ${blockData.name} - ${Object.keys(blockData.attributes).length} settings`);

        } catch (error) {
          errors.push({
            block: blockData.name,
            error: error.message
          });
          console.error(`❌ ${blockData.name}:`, error.message);
        }
      }

      // Save the post
      await new Promise(resolve => setTimeout(resolve, 1000));
      await dispatch('core/editor').savePost();
      await new Promise(resolve => setTimeout(resolve, 2000));

      const isSaved = select('core/editor').isSavingPost() === false &&
                      select('core/editor').isAutosavingPost() === false;

      return {
        totalTested: blocksToTest.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors,
        saved: isSaved,
        postId: select('core/editor').getCurrentPostId(),
        permalink: select('core/editor').getPermalink()
      };
    });

    console.log('\n=== TEST RESULTS ===\n');
    console.log(`Total Blocks Tested: ${results.totalTested}`);
    console.log(`Successful: ${results.successful}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Post Saved: ${results.saved}`);
    console.log(`Post ID: ${results.postId}`);
    console.log(`Permalink: ${results.permalink}`);

    if (results.errors.length > 0) {
      console.log('\n=== ERRORS ===\n');
      results.errors.forEach(err => {
        console.log(`❌ ${err.block}: ${err.error}`);
      });
    }

    console.log('\n=== Console Errors During Test ===\n');
    const errorLogs = consoleMessages.filter(msg => msg.type === 'error');
    if (errorLogs.length > 0) {
      errorLogs.forEach(log => console.log(`❌ ${log.text}`));
    } else {
      console.log('✅ No console errors detected');
    }

    // Take screenshot
    await page.screenshot({
      path: 'comprehensive_test_editor.png',
      fullPage: false
    });

    console.log('\n✅ Screenshot saved: comprehensive_test_editor.png');

    // Wait to see results
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})();
