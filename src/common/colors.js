export default {
  WHITE: '#FFFFFF',
  RED: 'red',
  BACKGROUNDCOLOR:'#051D40',
  BUTTONBG:'#C51A25',
  CREATEACCOUNT:'#FF574E',
  PRIMARYTEXT: '#C51A25',
  SEPARATORCOLOR:'#CCCCCC',
  INTROBG:'#C51A25',
  SEPARATORCOLOR:'#8C0000',
  BLUETHEMECOLOR:'#062244',
  BLACK:'black'
};


const lighten = (value) => {
  const MAX_HEX_VALUE = 255;
  const hexValue = Math.floor(MAX_HEX_VALUE * Math.min(value, 1)).toString(16);
  return hexValue.length < 2 ? `0${hexValue}` : hexValue;
};

export const alpha = (color, value) => (
  color.startsWith('#') ? `${color}${lighten(value)}` : color);
