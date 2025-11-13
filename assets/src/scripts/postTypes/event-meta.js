/**
 * Event Meta Sidebar
 *
 * @author Hector Jarquin, Tomas Llobet-Arany
 * @package RIAPress
 */

if (document.body.classList.contains('block-editor-page')) {

    const {registerPlugin} = wp.plugins;
    const {PluginDocumentSettingPanel} = wp.editor;
    const {PanelRow, TextControl, CheckboxControl, Dropdown, DateTimePicker} = wp.components;
    const {useSelect, useDispatch} = wp.data;
    const {_x} = wp.i18n;
    const {useState, useEffect} = wp.element;

    const EventMetaSidebar = () => {
        const postType = useSelect((select) => select("core/editor").getCurrentPostType());
        const postMeta = useSelect((select) => select("core/editor").getEditedPostAttribute("meta"));
        const {editPost} = useDispatch("core/editor");

        console.log('EventMetaSidebar loaded', postType, postMeta);

        const [dateStartPicker, setDateStartPicker] = useState(null);
        const [dateEndPicker, setDateEndPicker] = useState(null);

        // Check if the current post type is 'event'
        if (postType !== "event") {
            return null;
        }

        const updateMeta = (metaKey, value) => {
            editPost({meta: {[metaKey]: value}});
        };

        // Update date pickers with meta values
        useEffect(() => {
            if (postMeta._rp_event_date_start && postMeta._rp_event_time_start) {
                setDateStartPicker(new Date(`${postMeta._rp_event_date_start}T${postMeta._rp_event_time_start}`));
            }
        }, [postMeta._rp_event_date_start, postMeta._rp_event_time_start]);

        useEffect(() => {
            if (postMeta._rp_event_date_end && postMeta._rp_event_time_end) {
                setDateEndPicker(new Date(`${postMeta._rp_event_date_end}T${postMeta._rp_event_time_end}`));
            }
        }, [postMeta._rp_event_date_end, postMeta._rp_event_time_end]);

        // Handle date and time changes
        const onDateStartChange = (newDateStartPicker) => {
            const parsedDate = new Date(newDateStartPicker);
            setDateStartPicker(parsedDate);

            const formattedDate = parsedDate.toISOString().split("T")[0];
            const formattedTime = parsedDate.toTimeString().split(" ")[0].substring(0, 5);

            // Store full timestamp - may be needed for some use cases
            updateMeta("_rp_event_datetime_start", newDateStartPicker);
            // Store only date
            updateMeta("_rp_event_date_start", formattedDate);
            // Store only time
            updateMeta("_rp_event_time_start", formattedTime);
        };

        const onDateEndChange = (newDateEndPicker) => {
            const parsedDate = new Date(newDateEndPicker);
            setDateEndPicker(parsedDate);

            const formattedDate = parsedDate.toISOString().split("T")[0];
            const formattedTime = parsedDate.toTimeString().split(" ")[0].substring(0, 5);

            // Store full timestamp - may be needed for some use cases
            updateMeta("_rp_event_datetime_end", newDateEndPicker);
            // Store only date
            updateMeta("_rp_event_date_end", formattedDate);
            // Store only time
            updateMeta("_rp_event_time_end", formattedTime);
        };

        return (
            <PluginDocumentSettingPanel
                name="event-meta-sidebar"
                title={_x("Event Meta", "Event Meta Title - Document Setting Panel", "event-meta")}
                className="event-meta-sidebar"
            >
                <PanelRow>
                    <Dropdown
                        style={{width: `100%`}}
                        className="start-date-time-picker"
                        popoverProps={{placement: 'bottom-start'}}
                        renderToggle={({isOpen, onToggle}) => (
                            <TextControl
                                label={_x("Start", "Block - Event Meta - Label", "event-meta")}
                                value={dateStartPicker ? dateStartPicker.toLocaleString() : ''}
                                onClick={onToggle}
                                aria-expanded={isOpen}
                            />
                        )}
                        renderContent={() => (
                            <DateTimePicker
                                currentDate={dateStartPicker}
                                onChange={onDateStartChange}
                                is12Hour={true}
                            />
                        )}
                    />
                </PanelRow>
                <PanelRow>
                    <Dropdown
                        style={{width: `100%`}}
                        className="end-date-time-picker"
                        popoverProps={{placement: 'bottom-start'}}
                        renderToggle={({isOpen, onToggle}) => (
                            <TextControl
                                label={_x("End", "Block - Event Meta - Label", "event-meta")}
                                value={dateEndPicker ? dateEndPicker.toLocaleString() : ''}
                                onClick={onToggle}
                                aria-expanded={isOpen}
                            />
                        )}
                        renderContent={() => (
                            <DateTimePicker
                                currentDate={dateEndPicker}
                                onChange={onDateEndChange}
                                is12Hour={true}
                            />
                        )}
                    />
                </PanelRow>

                <PanelRow>
                    <TextControl
                        label={_x("Address", "Event Meta Label", "event-meta")}
                        type="text"
                        value={postMeta._rp_event_address}
                        onChange={(value) => updateMeta("_rp_event_address", value)}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label={_x("Cost", "Event Meta Label", "event-meta")}
                        type="number"
                        value={postMeta._rp_event_cost}
                        onChange={(value) => updateMeta("_rp_event_cost", value)}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label={_x("Dress Code", "Event Meta Label", "event-meta")}
                        type="text"
                        value={postMeta._rp_event_dress}
                        onChange={(value) => updateMeta("_rp_event_dress", value)}
                    />
                </PanelRow>
                <PanelRow>
                    <TextControl
                        label={_x("Buy Ticket URL", "Event Meta Label", "event-meta")}
                        type="text"
                        value={postMeta._rp_event_ticket_url}
                        onChange={(value) => updateMeta("_rp_event_ticket_url", value)}
                    />
                </PanelRow>
                <PanelRow>
                    <CheckboxControl
                        label={_x("Open in New Tab", "Event Meta Label", "event-meta")}
                        checked={Boolean(postMeta._rp_event_ticket_url_new_tab)}
                        onChange={(value) => updateMeta("_rp_event_ticket_url_new_tab", value)}
                    />
                </PanelRow>
            </PluginDocumentSettingPanel>
        );
    };

    registerPlugin("event-meta-sidebar", {render: EventMetaSidebar});
}