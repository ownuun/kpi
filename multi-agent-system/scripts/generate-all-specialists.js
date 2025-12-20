const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', '.claude', 'agents', 'level-4-specialists');

function createSpecialist(name, description) {
  const content = `---
name: ${name}
description: ${description}
tools: Write, Edit, Read, WebSearch
model: haiku
permissionMode: acceptEdits
---

# ${name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}

## 🔍 Start
\`\`\`typescript
await webSearch("${description.split('.')[0]} best practices 2025");
await webSearch("${name.replace('-builder', '').replace('-expert', '').replace('-', ' ')} implementation 2025");
\`\`\`

## 🎯 Implementation
\`\`\`tsx
// Implementation will be added based on latest 2025 best practices
// This specialist will search for and implement the most current patterns
\`\`\`
`;

  const filePath = path.join(baseDir, `${name}.md`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

let totalCreated = 0;

// 2. Advanced Layout Specialists (95개)
console.log('\n📐 Creating Advanced Layout Specialists...');
const layouts = [
  // Container Layouts
  { name: 'flex-layout-builder', desc: 'Flexbox 레이아웃 전문가. Direction, justify, align.' },
  { name: 'grid-auto-layout-builder', desc: 'CSS Grid Auto 전문가. Auto-fill, auto-fit, minmax.' },
  { name: 'masonry-layout-builder', desc: 'Masonry 레이아웃 전문가. Pinterest-style, isotope.' },
  { name: 'split-pane-builder', desc: 'Split Pane 전문가. Resizable panels, horizontal/vertical.' },
  { name: 'sidebar-layout-builder', desc: 'Sidebar 레이아웃 전문가. 고정/축소 사이드바, 반응형.' },
  { name: 'header-footer-layout-builder', desc: 'Header/Footer 레이아웃 전문가. Sticky header, footer.' },
  { name: 'holy-grail-layout-builder', desc: 'Holy Grail 레이아웃 전문가. 3-column, flexbox/grid.' },
  { name: 'dashboard-layout-builder', desc: 'Dashboard 레이아웃 전문가. Widgets, drag-drop.' },
  { name: 'kanban-layout-builder', desc: 'Kanban 레이아웃 전문가. Columns, cards, drag-drop.' },
  { name: 'timeline-layout-builder', desc: 'Timeline 레이아웃 전문가. 시간순 배치, vertical/horizontal.' },

  // Cards & Panels
  { name: 'expandable-card-builder', desc: '확장 카드 전문가. Accordion-style, 상세보기.' },
  { name: 'flip-card-builder', desc: 'Flip Card 전문가. 3D flip animation, 앞뒤.' },
  { name: 'hover-card-builder', desc: 'Hover Card 전문가. Hover시 확장, tooltip-style.' },
  { name: 'pricing-card-builder', desc: 'Pricing Card 전문가. 가격표, features, CTA.' },
  { name: 'profile-card-builder', desc: 'Profile Card 전문가. 사용자 프로필, 아바타, 정보.' },
  { name: 'testimonial-card-builder', desc: 'Testimonial Card 전문가. 후기, 별점, 사진.' },
  { name: 'product-card-builder', desc: 'Product Card 전문가. 상품, 이미지, 가격, 장바구니.' },
  { name: 'blog-card-builder', desc: 'Blog Card 전문가. 블로그 포스트, 썸네일, 요약.' },
  { name: 'stat-card-builder', desc: 'Stat Card 전문가. 통계, KPI, 증감 표시.' },
  { name: 'notification-card-builder', desc: 'Notification Card 전문가. 알림, timestamp, 읽음표시.' },

  // Modals & Overlays
  { name: 'fullscreen-modal-builder', desc: '전체화면 모달 전문가. Fullscreen overlay.' },
  { name: 'drawer-builder', desc: 'Drawer 전문가. Side drawer, slide-in panel.' },
  { name: 'bottom-sheet-builder', desc: 'Bottom Sheet 전문가. Mobile bottom sheet, swipe.' },
  { name: 'lightbox-builder', desc: 'Lightbox 전문가. 이미지 확대, gallery, zoom.' },
  { name: 'confirm-dialog-builder', desc: 'Confirm Dialog 전문가. 확인/취소, async.' },
  { name: 'alert-dialog-builder', desc: 'Alert Dialog 전문가. 경고, 정보, 에러.' },
  { name: 'prompt-dialog-builder', desc: 'Prompt Dialog 전문가. 사용자 입력, confirm.' },
  { name: 'sheet-dialog-builder', desc: 'Sheet Dialog 전문가. Form sheet, multi-step.' },
  { name: 'popover-builder', desc: 'Popover 전문가. Floating UI, positioning.' },
  { name: 'tooltip-builder', desc: 'Tooltip 전문가. Hover tooltip, delay, arrow.' },

  // Tables & Lists
  { name: 'data-table-builder', desc: 'Data Table 전문가. TanStack Table, sorting, filtering.' },
  { name: 'tree-table-builder', desc: 'Tree Table 전문가. Hierarchical data, expand/collapse.' },
  { name: 'pivot-table-builder', desc: 'Pivot Table 전문가. Pivot data, aggregation.' },
  { name: 'virtual-table-builder', desc: 'Virtual Table 전문가. Virtualization, 대용량 데이터.' },
  { name: 'editable-table-builder', desc: 'Editable Table 전문가. Inline editing, validation.' },
  { name: 'grouped-table-builder', desc: 'Grouped Table 전문가. Row grouping, subtotals.' },
  { name: 'frozen-table-builder', desc: 'Frozen Table 전문가. Fixed columns/rows, scroll.' },
  { name: 'timeline-table-builder', desc: 'Timeline Table 전문가. Gantt-style, time columns.' },
  { name: 'list-view-builder', desc: 'List View 전문가. Item list, pagination, search.' },
  { name: 'virtual-list-builder', desc: 'Virtual List 전문가. react-window, 대용량.' },
  { name: 'grid-view-builder', desc: 'Grid View 전문가. Card grid, responsive columns.' },
  { name: 'gallery-view-builder', desc: 'Gallery View 전문가. Image gallery, masonry.' },
  { name: 'tree-view-builder', desc: 'Tree View 전문가. Folder tree, expand/collapse.' },
  { name: 'nested-list-builder', desc: 'Nested List 전문가. Recursive list, indentation.' },

  // Navigation
  { name: 'accordion-builder', desc: 'Accordion 전문가. Collapsible sections, single/multiple.' },
  { name: 'breadcrumb-builder', desc: 'Breadcrumb 전문가. 경로 표시, 네비게이션.' },
  { name: 'pagination-builder', desc: 'Pagination 전문가. 페이지 네비게이션, 숫자.' },
  { name: 'infinite-scroll-builder', desc: 'Infinite Scroll 전문가. 무한 스크롤, lazy load.' },
  { name: 'load-more-builder', desc: 'Load More 전문가. 더보기 버튼, batch loading.' },
  { name: 'step-indicator-builder', desc: 'Step Indicator 전문가. Progress steps, wizard.' },
  { name: 'progress-bar-builder', desc: 'Progress Bar 전문가. Linear progress, percentage.' },
  { name: 'progress-circle-builder', desc: 'Progress Circle 전문가. Circular progress, arc.' },
  { name: 'stepper-builder', desc: 'Stepper 전문가. Multi-step form, navigation.' },
  { name: 'wizard-builder', desc: 'Wizard 전문가. Step-by-step, validation, back/next.' },

  // Tabs & Panels
  { name: 'vertical-tabs-builder', desc: 'Vertical Tabs 전문가. 세로 탭, 사이드 네비게이션.' },
  { name: 'dynamic-tabs-builder', desc: 'Dynamic Tabs 전문가. 탭 추가/삭제, closeable.' },
  { name: 'nested-tabs-builder', desc: 'Nested Tabs 전문가. 중첩 탭, sub-tabs.' },
  { name: 'scrollable-tabs-builder', desc: 'Scrollable Tabs 전문가. 스크롤 가능, 많은 탭.' },
  { name: 'tab-panel-builder', desc: 'Tab Panel 전문가. Tab content, lazy load.' },
  { name: 'collapsible-panel-builder', desc: 'Collapsible Panel 전문가. Expand/collapse, animation.' },
  { name: 'resizable-panel-builder', desc: 'Resizable Panel 전문가. react-resizable-panels.' },
  { name: 'floating-panel-builder', desc: 'Floating Panel 전문가. Draggable panel, overlay.' },
  { name: 'sticky-panel-builder', desc: 'Sticky Panel 전문가. Sticky positioning, scroll.' },
  { name: 'sliding-panel-builder', desc: 'Sliding Panel 전문가. Slide in/out, animation.' },

  // Specialized
  { name: 'carousel-builder', desc: 'Carousel 전문가. Image carousel, swipe, autoplay.' },
  { name: 'slider-carousel-builder', desc: 'Slider Carousel 전문가. Content slider, infinite.' },
  { name: 'thumbnail-carousel-builder', desc: 'Thumbnail Carousel 전문가. 썸네일 + 큰 이미지.' },
  { name: 'video-carousel-builder', desc: 'Video Carousel 전문가. 비디오 슬라이더.' },
  { name: 'hero-section-builder', desc: 'Hero Section 전문가. Landing hero, CTA, background.' },
  { name: 'feature-section-builder', desc: 'Feature Section 전문가. Feature grid, icons, 설명.' },
  { name: 'cta-section-builder', desc: 'CTA Section 전문가. Call-to-action, button, form.' },
  { name: 'footer-section-builder', desc: 'Footer Section 전문가. 푸터, links, 저작권.' },
  { name: 'navbar-builder', desc: 'Navbar 전문가. 네비게이션 바, responsive, mobile.' },
  { name: 'sidebar-menu-builder', desc: 'Sidebar Menu 전문가. Navigation menu, icons, collapse.' },
  { name: 'mega-menu-builder', desc: 'Mega Menu 전문가. 대형 드롭다운 메뉴, multi-column.' },
  { name: 'dropdown-menu-builder', desc: 'Dropdown Menu 전문가. 드롭다운, hover/click.' },
  { name: 'context-menu-builder', desc: 'Context Menu 전문가. 우클릭 메뉴, actions.' },
  { name: 'command-menu-builder', desc: 'Command Menu 전문가. ⌘K menu, search commands.' },
  { name: 'app-shell-builder', desc: 'App Shell 전문가. Application layout, shell structure.' },
  { name: 'split-screen-builder', desc: 'Split Screen 전문가. 화면 분할, side-by-side.' },
  { name: 'picture-in-picture-builder', desc: 'Picture-in-Picture 전문가. PIP overlay, video.' },
  { name: 'sticky-header-builder', desc: 'Sticky Header 전문가. 고정 헤더, scroll reveal.' },
  { name: 'floating-action-button-builder', desc: 'FAB 전문가. Floating action button, speed dial.' },
  { name: 'skeleton-loader-builder', desc: 'Skeleton Loader 전문가. Loading skeleton, placeholder.' },
  { name: 'empty-state-builder', desc: 'Empty State 전문가. No data state, illustration, CTA.' },
  { name: 'error-state-builder', desc: 'Error State 전문가. Error page, 404, 500.' },
  { name: 'loading-state-builder', desc: 'Loading State 전문가. Loading indicators, spinner.' },
  { name: 'success-state-builder', desc: 'Success State 전문가. Success message, confirmation.' },
  { name: 'container-query-builder', desc: 'Container Query 전문가. CSS container queries, responsive.' }
];

layouts.forEach(spec => {
  if (createSpecialist(spec.name, spec.desc)) totalCreated++;
});

console.log(`✅ Created ${layouts.length} layout specialists`);

// 3. Advanced Chart Specialists (95개)
console.log('\n📊 Creating Advanced Chart Specialists...');
const charts = [
  // Time Series
  { name: 'time-series-chart-builder', desc: 'Time Series Chart 전문가. 시계열 데이터, zoom, pan.' },
  { name: 'candlestick-chart-builder', desc: 'Candlestick Chart 전문가. 주식 차트, OHLC.' },
  { name: 'ohlc-chart-builder', desc: 'OHLC Chart 전문가. Open-High-Low-Close, financial.' },
  { name: 'sparkline-chart-builder', desc: 'Sparkline 전문가. Mini chart, inline, trend.' },
  { name: 'step-chart-builder', desc: 'Step Chart 전문가. Step-wise line chart.' },
  { name: 'stream-graph-builder', desc: 'Stream Graph 전문가. Stacked area, flowing.' },

  // Bar & Column
  { name: 'stacked-bar-chart-builder', desc: 'Stacked Bar Chart 전문가. 누적 막대, 100%.' },
  { name: 'grouped-bar-chart-builder', desc: 'Grouped Bar Chart 전문가. 그룹 막대, side-by-side.' },
  { name: 'waterfall-chart-builder', desc: 'Waterfall Chart 전문가. 폭포수 차트, 증감.' },
  { name: 'tornado-chart-builder', desc: 'Tornado Chart 전문가. Diverging bar, comparison.' },
  { name: 'lollipop-chart-builder', desc: 'Lollipop Chart 전문가. Dot + line, alternatives.' },
  { name: 'bullet-chart-builder', desc: 'Bullet Chart 전문가. KPI, target, range.' },
  { name: 'histogram-chart-builder', desc: 'Histogram 전문가. 분포도, bins, frequency.' },

  // Pie & Donut
  { name: 'donut-chart-builder', desc: 'Donut Chart 전문가. 도넛 차트, center label.' },
  { name: 'semi-donut-chart-builder', desc: 'Semi Donut Chart 전문가. 반원 도넛, gauge-style.' },
  { name: 'nested-pie-chart-builder', desc: 'Nested Pie Chart 전문가. Sunburst, hierarchy.' },
  { name: 'exploded-pie-chart-builder', desc: 'Exploded Pie Chart 전문가. 분리된 조각.' },

  // Scatter & Bubble
  { name: 'scatter-plot-builder', desc: 'Scatter Plot 전문가. 산점도, correlation.' },
  { name: 'bubble-chart-builder', desc: 'Bubble Chart 전문가. 3차원 데이터, size.' },
  { name: 'scatter-3d-chart-builder', desc: '3D Scatter Chart 전문가. 3D 산점도.' },

  // Specialized
  { name: 'heatmap-chart-builder', desc: 'Heatmap 전문가. 색상 맵, intensity, calendar.' },
  { name: 'treemap-chart-builder', desc: 'Treemap 전문가. Hierarchical rectangles, size.' },
  { name: 'sunburst-chart-builder', desc: 'Sunburst Chart 전문가. Radial hierarchy, drill-down.' },
  { name: 'sankey-diagram-builder', desc: 'Sankey Diagram 전문가. Flow diagram, energy.' },
  { name: 'chord-diagram-builder', desc: 'Chord Diagram 전문가. Circular relationship.' },
  { name: 'network-graph-builder', desc: 'Network Graph 전문가. Node-edge graph, force.' },
  { name: 'force-directed-graph-builder', desc: 'Force Directed Graph 전문가. D3 force simulation.' },
  { name: 'tree-diagram-builder', desc: 'Tree Diagram 전문가. Hierarchical tree, collapsible.' },
  { name: 'org-chart-builder', desc: 'Org Chart 전문가. Organization chart, hierarchy.' },
  { name: 'mind-map-builder', desc: 'Mind Map 전문가. Mind mapping, nodes.' },
  { name: 'gantt-chart-builder', desc: 'Gantt Chart 전문가. Project timeline, tasks.' },
  { name: 'calendar-heatmap-builder', desc: 'Calendar Heatmap 전문가. GitHub-style, contributions.' },
  { name: 'matrix-chart-builder', desc: 'Matrix Chart 전문가. 2D grid, correlation.' },
  { name: 'radar-chart-builder', desc: 'Radar Chart 전문가. Spider chart, multi-axis.' },
  { name: 'polar-chart-builder', desc: 'Polar Chart 전문가. Circular bar, radial.' },
  { name: 'rose-chart-builder', desc: 'Rose Chart 전문가. Nightingale rose, polar.' },
  { name: 'funnel-chart-builder', desc: 'Funnel Chart 전문가. Conversion funnel, stages.' },
  { name: 'pyramid-chart-builder', desc: 'Pyramid Chart 전문가. Age pyramid, demographics.' },
  { name: 'box-plot-builder', desc: 'Box Plot 전문가. Box-and-whisker, distribution.' },
  { name: 'violin-plot-builder', desc: 'Violin Plot 전문가. Distribution + box plot.' },
  { name: 'ridgeline-chart-builder', desc: 'Ridgeline Chart 전문가. Joy plot, distributions.' },
  { name: 'parallel-coordinates-builder', desc: 'Parallel Coordinates 전문가. Multi-dimensional data.' },
  { name: 'slope-chart-builder', desc: 'Slope Chart 전문가. Before-after comparison.' },
  { name: 'marimekko-chart-builder', desc: 'Marimekko Chart 전문가. Market share, mosaic.' },
  { name: 'word-cloud-builder', desc: 'Word Cloud 전문가. Text visualization, frequency.' },
  { name: 'circle-packing-builder', desc: 'Circle Packing 전문가. Hierarchical circles, nested.' },
  { name: 'arc-diagram-builder', desc: 'Arc Diagram 전문가. Network relationships, arcs.' },
  { name: 'alluvial-diagram-builder', desc: 'Alluvial Diagram 전문가. Flow over time, parallel.' },
  { name: 'dendrogram-builder', desc: 'Dendrogram 전문가. Tree clustering, hierarchy.' },
  { name: 'icicle-chart-builder', desc: 'Icicle Chart 전문가. Vertical hierarchy, rectangles.' },
  { name: 'flame-graph-builder', desc: 'Flame Graph 전문가. Performance profiling, stack.' },
  { name: 'voronoi-diagram-builder', desc: 'Voronoi Diagram 전문가. Proximity, regions.' },
  { name: 'contour-plot-builder', desc: 'Contour Plot 전문가. Elevation, density.' },
  { name: 'choropleth-map-builder', desc: 'Choropleth Map 전문가. 지역 색칠 지도.' },
  { name: 'symbol-map-builder', desc: 'Symbol Map 전문가. Bubble map, proportional.' },
  { name: 'flow-map-builder', desc: 'Flow Map 전문가. Migration, movement.' },
  { name: 'cartogram-builder', desc: 'Cartogram 전문가. Distorted map, area.' },
  { name: 'isotype-chart-builder', desc: 'Isotype Chart 전문가. Pictogram, icons.' },
  { name: 'pictorial-chart-builder', desc: 'Pictorial Chart 전문가. Custom shapes, images.' },
  { name: 'comparison-chart-builder', desc: 'Comparison Chart 전문가. Side-by-side comparison.' },
  { name: 'benchmark-chart-builder', desc: 'Benchmark Chart 전문가. Performance vs target.' },
  { name: 'kpi-dashboard-builder', desc: 'KPI Dashboard 전문가. Multiple metrics, cards.' },
  { name: 'sparkbar-builder', desc: 'Sparkbar 전문가. Inline bar chart, compact.' },
  { name: 'bullet-sparkline-builder', desc: 'Bullet Sparkline 전문가. Compact KPI, target.' },
  { name: 'trend-indicator-builder', desc: 'Trend Indicator 전문가. Up/down arrows, percentage.' },
  { name: 'delta-chart-builder', desc: 'Delta Chart 전문가. Change indicator, vs previous.' },
  { name: 'variance-chart-builder', desc: 'Variance Chart 전문가. Actual vs budget.' },
  { name: 'combo-chart-builder', desc: 'Combo Chart 전문가. Line + Bar combination.' },
  { name: 'dual-axis-chart-builder', desc: 'Dual Axis Chart 전문가. Two Y-axes, different scales.' },
  { name: 'multi-series-chart-builder', desc: 'Multi Series Chart 전문가. Multiple datasets.' },
  { name: 'animated-chart-builder', desc: 'Animated Chart 전문가. Chart animations, transitions.' },
  { name: 'real-time-chart-builder', desc: 'Real-time Chart 전문가. Live data, streaming.' },
  { name: 'zoomable-chart-builder', desc: 'Zoomable Chart 전문가. Zoom, pan, brush.' },
  { name: 'brushable-chart-builder', desc: 'Brushable Chart 전문가. Brush selection, filter.' },
  { name: 'crosshair-chart-builder', desc: 'Crosshair Chart 전문가. Crosshair tooltip, sync.' },
  { name: 'synchronized-chart-builder', desc: 'Synchronized Chart 전문가. Multiple charts sync.' },
  { name: 'responsive-chart-builder', desc: 'Responsive Chart 전문가. Auto-resize, mobile.' },
  { name: 'exportable-chart-builder', desc: 'Exportable Chart 전문가. PNG/SVG/PDF export.' },
  { name: 'printable-chart-builder', desc: 'Printable Chart 전문가. Print-optimized.' },
  { name: 'accessible-chart-builder', desc: 'Accessible Chart 전문가. WCAG, screen reader.' },
  { name: 'dark-mode-chart-builder', desc: 'Dark Mode Chart 전문가. Theme switching.' },
  { name: 'custom-theme-chart-builder', desc: 'Custom Theme Chart 전문가. Color schemes.' },
  { name: 'annotation-chart-builder', desc: 'Annotation Chart 전문가. Labels, markers, regions.' },
  { name: 'threshold-chart-builder', desc: 'Threshold Chart 전문가. Alert lines, zones.' },
  { name: 'reference-line-chart-builder', desc: 'Reference Line Chart 전문가. Baseline, target.' },
  { name: 'error-bar-chart-builder', desc: 'Error Bar Chart 전문가. Error bars, confidence.' },
  { name: 'prediction-chart-builder', desc: 'Prediction Chart 전문가. Forecast, trend projection.' },
  { name: 'anomaly-chart-builder', desc: 'Anomaly Chart 전문가. Outlier detection, highlight.' },
  { name: 'small-multiples-builder', desc: 'Small Multiples 전문가. Faceted charts, grid.' },
  { name: 'mini-chart-builder', desc: 'Mini Chart 전문가. Compact charts, table cells.' },
  { name: 'chart-grid-builder', desc: 'Chart Grid 전문가. Dashboard grid, multiple charts.' }
];

charts.forEach(spec => {
  if (createSpecialist(spec.name, spec.desc)) totalCreated++;
});

console.log(`✅ Created ${charts.length} chart specialists`);

console.log(`\n🎉 Total Created: ${totalCreated} specialists`);
