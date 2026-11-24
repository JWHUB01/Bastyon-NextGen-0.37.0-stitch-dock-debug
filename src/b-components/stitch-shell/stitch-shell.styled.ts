import styled from 'vue3-styled-components'

// Палитра из макета Google Stitch (DESIGN.md, «Obsidian Gloss Media»).
// Док и панель не следуют теме приложения: макет тёмный, стекло обсидиановое.
const STITCH = {
  top: 'rgba(40, 42, 48, 0.95)',
  mid: 'rgba(30, 31, 38, 0.95)',
  bottom: 'rgba(12, 14, 20, 0.98)',
  primary: '#4cd7f6',
  primaryRgb: '76 215 246',
  text: '#e2e2eb',
  muted: '#bcc9cd',
} as const

const glass = `linear-gradient(180deg, ${STITCH.top} 0%, ${STITCH.mid} 55%, ${STITCH.bottom} 100%)`

// Тени и верхний блик — как в code.html: панель «висит» над доком.
const panelShadow =
  '0 -12px 48px rgba(0, 0, 0, 0.9), 0 24px 64px rgba(0, 0, 0, 0.95), inset 0 1.5px 1px rgba(255, 255, 255, 0.35)'
const dockShadow =
  '0 -4px 24px rgba(0, 0, 0, 0.85), 0 12px 28px rgba(0, 0, 0, 0.95), inset 0 1.5px 1px rgba(255, 255, 255, 0.28)'

export const SC_Dock = styled.nav`
  position: fixed;
  left: 8px;
  right: 8px;
  bottom: calc(var(--safe-bottom) + 8px);
  z-index: 1050;
  max-width: 374px;
  margin: 0 auto;
  padding: 4px;
  border-radius: 16px;
  background: ${glass};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgb(${STITCH.primaryRgb} / 30%);
  box-shadow: ${dockShadow};

  /* Верхняя световая линия: в макете она отделяет стекло от ленты. */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10px;
    right: 10px;
    height: 1.5px;
    border-radius: 999px;
    background: linear-gradient(90deg, transparent, rgb(${STITCH.primaryRgb} / 70%), transparent);
    pointer-events: none;
  }
`

export const SC_DockScroll = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const SC_Tab = styled.button`
  flex: 0 0 auto;
  min-width: 50px;
  height: 46px;
  padding: 0 6px;
  border: 0;
  border-radius: 12px;
  background: rgba(40, 42, 48, 0.4);
  color: ${STITCH.muted};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  position: relative;
  cursor: pointer;
  font: inherit;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;

  &:active {
    transform: scale(0.9);
  }

  /* Состояние — инлайновым стилем из компонента: правила этого styled-слоя
     в собранной странице не перебивают базовые, а inline всегда выигрывает. */
`

export const SC_TabLabel = styled.span`
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.01em;
  white-space: nowrap;
`

export const SC_TabBadge = styled.span`
  position: absolute;
  top: 3px;
  right: 6px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 999px;
  background: ${STITCH.primary};
  color: #003640;
  font-size: 9px;
  font-weight: 700;
  line-height: 14px;
  text-align: center;
`

export const SC_Panel = styled.section`
  position: fixed;
  left: 10px;
  right: 10px;
  bottom: calc(var(--safe-bottom) + 74px);
  z-index: 1040;
  max-width: 370px;
  margin: 0 auto;
  max-height: 440px;
  display: flex;
  flex-direction: column;
  border-radius: 26px;
  background: ${glass};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgb(${STITCH.primaryRgb} / 30%);
  box-shadow: ${panelShadow};
  overflow: hidden;
  transform-origin: bottom center;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease,
    max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity, max-height;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1.5px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), rgb(${STITCH.primaryRgb} / 80%));
    pointer-events: none;
  }

  /* Свёрнутое состояние задаёт компонент инлайновым стилем: так оно точно
     перебивает базовые правила и анимируется переходом выше. */
`

export const SC_PanelHandle = styled.button`
  flex: 0 0 auto;
  align-self: center;
  width: 40px;
  height: 4px;
  margin: 6px 0 2px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(61, 73, 76, 0.6), #869397, rgba(61, 73, 76, 0.6));
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25);
  cursor: pointer;
`

export const SC_PanelBar = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 10px 4px;
`

export const SC_PanelPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(12, 14, 20, 0.7);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15);
  color: ${STITCH.muted};
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: '';
    flex: 0 0 auto;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${STITCH.primary};
    box-shadow: 0 0 6px ${STITCH.primary};
  }
`

export const SC_PanelActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const SC_PanelButton = styled.button`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: rgba(40, 42, 48, 0.8);
  color: ${STITCH.text};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 6px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.15s ease;

  &:active {
    transform: scale(0.95);
  }
`

export const SC_Chips = styled.div`
  flex: 0 0 auto;
  display: flex;
  gap: 6px;
  padding: 0 10px 6px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const SC_Chip = styled.button`
  flex: 0 0 auto;
  padding: 3px 9px;
  border: 1px solid rgb(${STITCH.primaryRgb} / 18%);
  border-radius: 999px;
  background: rgba(40, 42, 48, 0.55);
  color: ${STITCH.muted};
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
`

/** Световая линия над активной вкладкой: рисуется отдельным элементом,
 *  потому что псевдоэлемент не переключается инлайновым стилем. */
export const SC_TabGlow = styled.span`
  position: absolute;
  top: -4px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 999px;
  background: rgb(${STITCH.primaryRgb} / 80%);
  filter: blur(2px);
  pointer-events: none;
`

export const SC_PanelBody = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 12px 14px;
`

export const SC_SectionCard = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid rgba(61, 73, 76, 0.6);
  border-radius: 16px;
  background: rgba(12, 14, 20, 0.55);
  color: ${STITCH.text};
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  &:active {
    background: rgba(40, 42, 48, 0.8);
  }
`

export const SC_SectionIcon = styled.span`
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: rgba(76, 215, 246, 0.12);
  color: ${STITCH.primary};
  font-size: 18px;
`

export const SC_SectionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const SC_SectionTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${STITCH.text};
`

export const SC_SectionArrow = styled.span`
  margin-left: auto;
  color: ${STITCH.muted};
  display: inline-flex;
`
