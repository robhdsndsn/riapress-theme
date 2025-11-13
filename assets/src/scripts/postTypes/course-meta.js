/**
 * Course Meta Sidebar
 *
 * @author Hector Jarquin, Tomas Llobet-Arany
 * @package RIAPress
 */

if (document.body.classList.contains('block-editor-page')) {

    const {registerPlugin} = wp.plugins;
    const {PluginDocumentSettingPanel} = wp.editor;
    const {PanelRow, TextControl, CheckboxControl, SelectControl, Dropdown, DateTimePicker} = wp.components;
    const {useSelect, useDispatch} = wp.data;
    const {_x} = wp.i18n;
    const {useState, useEffect} = wp.element;

    const CourseMetaSidebar = () => {
        const postType = useSelect((select) => select("core/editor").getCurrentPostType());
        const postMeta = useSelect((select) => select("core/editor").getEditedPostAttribute("meta"));
        const {editPost} = useDispatch("core/editor");

        // console.log('CourseMetaSidebar loaded', postType, postMeta);

        

        // Check if the current post type is 'course'
        if (postType !== "course") {
            return null;
        }

        const updateMeta = (metaKey, value) => {
            console.log('Updating meta:', metaKey, 'with value:', value);
            editPost({meta: {[metaKey]: value}});
        };
       

        return (
            <PluginDocumentSettingPanel
                name="course-meta-sidebar"
                title={_x("Course Meta", "Course Meta Title - Document Setting Panel", "course-meta")}
                className="course-meta-sidebar"
            >
                <PanelRow>
                    <TextControl
                        label={_x("Duration", "Course Meta Label", "course-meta")}
                        type="text"
                        value={postMeta?._rp_course_time || ''}
                        onChange={(value) => updateMeta("_rp_course_time", value)}
                    />
                </PanelRow>
                <PanelRow>
                    <div style={{ width: '100%' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                            {_x("Course Type", "Course Meta Label", "course-meta")}
                        </label>
                        <SelectControl
                            value={postMeta?._rp_course_type || ''}
                            options={[
                                { label: _x("Select", "Course Meta Option", "course-meta"), value: '' },
                                { label: _x("D2L Course", "Course Meta Option", "course-meta"), value: 'D2L' },
                                { label: _x("External Course", "Course Meta Option", "course-meta"), value: 'URL' }
                            ]}
                            onChange={(value) => updateMeta("_rp_course_type", value)}
                        />
                    </div>
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label={_x("Course URL", "Course Meta Label", "course-meta")}
                        type="text"
                        value={postMeta?._rp_course_url || ''}
                        onChange={(value) => updateMeta("_rp_course_url", value)}
                    />

                </PanelRow>
                <PanelRow>
                    <TextControl
                        label={_x("Enrollment Form ID", "Course Meta Label", "course-meta")}
                        type="text"
                        value={postMeta?._rp_enrollment_form_id || ''}
                        onChange={(value) => updateMeta("_rp_enrollment_form_id", value)}
                    />
                </PanelRow>
            </PluginDocumentSettingPanel>
        );
    };

    registerPlugin("course-meta-sidebar", {render: CourseMetaSidebar});
}