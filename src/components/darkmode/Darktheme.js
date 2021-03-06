import React from 'react';
import {useDarkMode} from './useDarkMode';
import {darkTheme} from './theme';
import {GlobalStyles} from './global';
import {ThemeProvider} from 'styled-components';
import Icon from "../../icons";

const Darktheme = () => {
    const [theme, toggleTheme] = useDarkMode();
    const themeMode = theme === 'light' ? darkTheme : darkTheme;
    return (
        <ThemeProvider theme={themeMode}>
            <GlobalStyles/>
            <button onClick={toggleTheme} className="dark-mode-button" disabled={true}
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                <Icon
                    viewClass="icon"
                    icon={theme === 'light' ? 'dayMode' : 'darkMode'}
                />
            </button>
        </ThemeProvider>
    );
};

export default Darktheme;
