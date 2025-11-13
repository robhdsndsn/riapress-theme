/**
 * RIAPress Block Animation Controls
 *
 * Adds animation controls to the block inspector for blocks that support animations.
 * Uses WordPress block editor APIs to add InspectorControls with animation settings.
 *
 * @version 1.0.0
 * @author Rob Hudson
 * @date 2025-10-31
 */

(function () {
  const { addFilter } = wp.hooks;
  const { Fragment, createElement } = wp.element;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, ToggleControl, SelectControl, RangeControl } = wp.components;
  const { __ } = wp.i18n;
  const { createHigherOrderComponent } = wp.compose;

  // Get configuration from PHP
  const animationConfig = window.riaAnimationConfig || {};
  const blocksWithAnimations = animationConfig.blocksWithAnimations || [];
  const animationTypes = animationConfig.animationTypes || [];
  const hoverAnimationTypes = animationConfig.hoverAnimationTypes || [];
  const easingTypes = animationConfig.easingTypes || [];

  /**
   * Add animation attributes to block supports
   */
  function addAnimationAttributes(settings, name) {
    // Only add to blocks that support animations
    if (!blocksWithAnimations.includes(name)) {
      return settings;
    }

    // Check if block already has animation attributes (from block.json)
    if (settings.attributes && settings.attributes.animationEnabled) {
      return settings;
    }

    // Add animation attributes if they don't exist
    settings.attributes = Object.assign({}, settings.attributes, {
      animationEnabled: {
        type: 'boolean',
        default: true,
      },
      animationType: {
        type: 'string',
        default: 'fadeInUp',
      },
      animationDuration: {
        type: 'number',
        default: 0.6,
      },
      animationDelay: {
        type: 'number',
        default: 0,
      },
      animationEasing: {
        type: 'string',
        default: 'ease-out',
      },
      hoverAnimation: {
        type: 'string',
        default: 'none',
      },
    });

    return settings;
  }

  addFilter(
    'blocks.registerBlockType',
    'ria/add-animation-attributes',
    addAnimationAttributes
  );

  /**
   * Add animation controls to block inspector
   */
  const withAnimationControls = createHigherOrderComponent(function (BlockEdit) {
    return function (props) {
      const { attributes, setAttributes, name } = props;

      // Only show controls for blocks that support animations
      if (!blocksWithAnimations.includes(name)) {
        return createElement(BlockEdit, props);
      }

      const {
        animationEnabled = true,
        animationType = 'fadeInUp',
        animationDuration = 0.6,
        animationDelay = 0,
        animationEasing = 'ease-out',
        hoverAnimation = 'none',
      } = attributes;

      const animationControls = [];

      // Toggle control for enabling/disabling
      animationControls.push(
        createElement(ToggleControl, {
          key: 'animation-enabled',
          label: __('Enable Animation', 'ria'),
          help: animationEnabled
            ? __('Animation is enabled for this block.', 'ria')
            : __('Animation is disabled for this block.', 'ria'),
          checked: animationEnabled,
          onChange: function (value) {
            setAttributes({ animationEnabled: value });
          },
        })
      );

      // Show animation controls only if enabled
      if (animationEnabled) {
        // Animation type selector
        animationControls.push(
          createElement(SelectControl, {
            key: 'animation-type',
            label: __('Animation Type', 'ria'),
            value: animationType,
            options: animationTypes,
            onChange: function (value) {
              setAttributes({ animationType: value });
            },
            help: __('Choose the entrance animation effect.', 'ria'),
          })
        );

        // Show duration, delay, and easing only if animation type is not 'none'
        if (animationType !== 'none') {
          animationControls.push(
            createElement(RangeControl, {
              key: 'animation-duration',
              label: __('Animation Duration', 'ria'),
              value: animationDuration,
              onChange: function (value) {
                setAttributes({ animationDuration: value });
              },
              min: 0.1,
              max: 3,
              step: 0.1,
              help: __('Duration in seconds (0.1 - 3.0).', 'ria'),
            })
          );

          animationControls.push(
            createElement(RangeControl, {
              key: 'animation-delay',
              label: __('Animation Delay', 'ria'),
              value: animationDelay,
              onChange: function (value) {
                setAttributes({ animationDelay: value });
              },
              min: 0,
              max: 2,
              step: 0.1,
              help: __('Delay before animation starts (0 - 2.0 seconds).', 'ria'),
            })
          );

          animationControls.push(
            createElement(SelectControl, {
              key: 'animation-easing',
              label: __('Animation Easing', 'ria'),
              value: animationEasing,
              options: easingTypes,
              onChange: function (value) {
                setAttributes({ animationEasing: value });
              },
              help: __('Choose the animation timing function.', 'ria'),
            })
          );
        }

        // Horizontal rule
        animationControls.push(
          createElement('hr', {
            key: 'animation-hr',
            style: { margin: '20px 0' },
          })
        );

        // Hover animation selector
        animationControls.push(
          createElement(SelectControl, {
            key: 'hover-animation',
            label: __('Hover Animation', 'ria'),
            value: hoverAnimation,
            options: hoverAnimationTypes,
            onChange: function (value) {
              setAttributes({ hoverAnimation: value });
            },
            help: __('Choose the hover/focus animation effect.', 'ria'),
          })
        );
      }

      return createElement(
        Fragment,
        null,
        createElement(BlockEdit, props),
        createElement(
          InspectorControls,
          null,
          createElement(
            PanelBody,
            {
              title: __('Animation Settings', 'ria'),
              initialOpen: false,
              icon: 'art',
            },
            animationControls
          )
        )
      );
    };
  }, 'withAnimationControls');

  addFilter(
    'editor.BlockEdit',
    'ria/with-animation-controls',
    withAnimationControls
  );

  /**
   * Add animation classes to block wrapper in editor (preview)
   */
  function addAnimationClassToEditor(BlockListBlock) {
    return function (props) {
      const { attributes, name } = props;

      // Only add to blocks that support animations
      if (!blocksWithAnimations.includes(name)) {
        return createElement(BlockListBlock, props);
      }

      const {
        animationEnabled = true,
        animationType = 'fadeInUp',
        hoverAnimation = 'none',
      } = attributes;

      // Add animation class for preview (but don't actually animate in editor)
      if (animationEnabled && animationType !== 'none') {
        const customClassName = 'ria-animate-preview ria-animate-' + animationType;
        const newProps = Object.assign({}, props, {
          className: customClassName,
        });

        if (hoverAnimation !== 'none') {
          newProps['data-hover-animation'] = hoverAnimation;
        }

        return createElement(BlockListBlock, newProps);
      }

      return createElement(BlockListBlock, props);
    };
  }

  addFilter(
    'editor.BlockListBlock',
    'ria/add-animation-class-to-editor',
    addAnimationClassToEditor
  );
})();
