'use strict'

/**
 * Dependencies
 */

const Tab = require('./Tab')

class Tabs {

    /**
     * Create tabs container and set theme
     *
     * @param {Element} rootEl Container element for tabs
     * @param {String} theme Theme for the tab
     */

    constructor(rootEl, theme) {
        /* this.container = $(rootEl).tabs({
             activate: (event, ui) => {
                 this.activeTabEl = ui.newTab
                 this.activeTabId = ui.newTab.data('tab')
             }
         })*/
        this.container = rootEl;
        this.tabBar = this.container.querySelector('#tab-header')
        this.tabs = []
        this.totalTabsCreated = 0 // Counter for unique tab ids
        this.theme = theme
        this.init()
    }

    /**
     * Binds a listener to the new tab button and creates first tab
     */

    init() {
        const newTabButton = this.tabBar.querySelector('#new-tab')
        newTabButton.addEventListener('click', () => {
            //  newTabButton.click(() => {
            this.newTab()
        })
    }

    /**
     * Sets theme for all tabs
     *
     * @param {String} theme
     */

    setTheme(theme) {
        this.theme = theme
        this.tabs.forEach(tab => tab.setTheme(theme))
    }

    /**
     * Removes tab and cleans up any children
     *
     * @param {Element} tabEl The tab element to remove
     */

    removeTab(tabEl = this.activeTabEl) {
        if (this.tabs.length === 1) {
            return
        }

        const tabIndex = tabEl.index()
        const tabId = tabEl.remove().data('tab')

        $(`#tab-${tabId}`).remove()
        const removedTab = this.tabs.splice(tabIndex, 1)[0]
        removedTab.destroy()

        // this.container.tabs('refresh')

        if (this.tabs.length === 1) {
            this.hideTabBar()
        }
    }

    /**
     * Adds a new tab
     *
     * @param {String} input The text to start the editor with
     * @param {Integer} currsorPos The line to start the cursor on
     */

    newTab(input, tabName, filename) {

        // Generate HTML

        // const tabEl = $(Tab.generateTabHeaderTemplate(this.totalTabsCreated, tabName, filename))
        // const contentEl = $(Tab.generateTabContentTemplate(this.totalTabsCreated))

        // Setup listener to remove tab
        // const removeButton = tabEl.find('.ui-icon-close')
        // removeButton.click(() => this.removeTab(tabEl))

        // Append tab to tab Bar
        // this.tabBar.find('li:last-child').before(tabEl)
        const newTab = new Tab(this.totalTabsCreated, tabName, filename);
        newTab.setTheme(this.theme)
        this.tabBar.outerHTML = newTab.generateTabHeader() + this.tabBar.outerHTML;
        const tabEl = this.tabBar.querySelector('li:nth-last-child(2)');
        const removeButton = tabEl.querySelector('.ui-icon-close')
        removeButton.addEventListener('click', () => { this.removeTab(tabEl) })
            // this.container.append(contentEl)

        // Create the new tab
        //  const newTab = new Tab(contentEl, tabName, filename)

        this.tabs.push(newTab)

        // Refresh tabs and set new tab as active
        //this.container.tabs('refresh')
        //this.container.tabs('option', 'active', this.tabs.length - 1)
        //TODO add active class

        if (input) {
            newTab.editor.setValue(input)
        }

        this.totalTabsCreated += 1

        if (this.tabs.length > 1 && this.container.classList.contains('tab-bar-hidden')) {
            this.showTabBar()
        }
    }

    /**
     * Shows tab bar
     */

    showTabBar() {
        this.container.classList.remove('tab-bar-hidden')
    }

    /**
     * Hides tab bar
     */

    hideTabBar() {
        this.container.classList.add('tab-bar-hidden')
    }

    /**
     * Change active tab
     */

    changeTab(direction) {
        let totalTabs = this.tabs.length
        if (totalTabs > 0) {
            let currentIndex = this.container.tabs('option', 'active');
            let position = currentIndex + direction;
            // if we are at the end go to first tab
            if (position >= totalTabs) {
                position = 0;
            }
            //if we are at the first tab and user goes back jump to end
            else if (position < 0) {
                position = totalTabs - 1
            }
            this.container.tabs('option', 'active', position)
        }
    }
}


/**
 * Export app
 */

module.exports = Tabs