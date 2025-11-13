/**
 * Post Meta Sidebar - Template for Post Type Meta Fields
 *
 * This file is used to create a custom sidebar for the post meta fields.
 * - Change the name of the PostMetaSidebar to the name of your post type and the registerPlugin at the end
 * - Change the name of the meta fields to the name of your post type
 * - Change the text domains to the name of your post type
 * - Remove all unused code
 *
 * @author Hector Jarquin, Tomas Llobet-Arany
 * @package RIAPress
 */
if (document.body.classList.contains('block-editor-page')) {
    const {registerPlugin} = wp.plugins;
    const {PluginDocumentSettingPanel} = wp.editPost;
    const {PanelRow, TextControl, CheckboxControl, Dropdown, DateTimePicker} = wp.components;
    const {useSelect, useDispatch} = wp.data;
    const {_x} = wp.i18n;
    const {useState, useEffect} = wp.element;

    // Change the Name of the PostMetaSidebar to the name of your post type
    const PostMetaSidebar = () => {
        const postType = useSelect((select) => select("core/editor").getCurrentPostType());
        const postMeta = useSelect((select) => select("core/editor").getEditedPostAttribute("meta"));
        const {editPost} = useDispatch("core/editor");

        // Check if the current post type is 'post' - change this to the post type you need
        if (postType !== "post") {
            return null;
        }

        const updateMeta = (metaKey, value) => {
            editPost({meta: {[metaKey]: value}});
        };

        return (
            <PluginDocumentSettingPanel
                name="post-meta-sidebar"
                title={_x("Post Meta", "Post Meta Title - Document Setting Panel", "post-meta")}
                className="post-meta-sidebar"
            >
                <PanelRow>
                    <TextControl
                        label={_x("Test Meta 1", "Post Meta Label", "post-meta")}
                        type="text"
                        value={postMeta._rp_post_test_meta_text}
                        onChange={(value) => updateMeta("_rp_post_test_meta_text", value)}
                    />
                </PanelRow>

                <PanelRow>
                    <CheckboxControl
                        label={_x("Open in New Tab", "Post Meta Label", "post-meta")}
                        checked={Boolean(postMeta._rp_post_test_meta_checkbox)}
                        onChange={(value) => updateMeta("_rp_post_test_meta_checkbox", value)}
                    />
                </PanelRow>
            </PluginDocumentSettingPanel>
        );
    };

    registerPlugin("post-meta-sidebar", {render: PostMetaSidebar});
}