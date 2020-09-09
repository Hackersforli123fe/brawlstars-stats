import Vue, { PropType } from 'vue'
import { min, max, parseISO, formatRelative, eachMonthOfInterval } from 'date-fns'
import { TrophiesRow } from '~/model/Clicker'

export default Vue.extend({
  functional: true,
  props: {
    history: {
      type: Array as PropType<TrophiesRow[]>,
      required: true,
    },
  },
  render(h, { props }) {
    const dates = props.history.map(({ timestamp }) => timestamp as unknown as string)
    const datesD = dates.map(d => parseISO(d))
    const trophies = props.history.map(({ trophies }) => trophies)
    const start = min(datesD)
    const end = max(datesD)
    // TODO use trophy season end dates
    const ticks = eachMonthOfInterval({ start, end })
    const ticksText = ticks.map(d => formatRelative(d, new Date()))

    const traces = [{
      x: dates,
      y: trophies,
      mode: 'lines',
      type: 'scatter',
      line: {
        color: '#f2d024',
      },
      marker: {
        color: '#f2d024',
      },
    }]

    const layout = {
      xaxis: {
        fixedrange: true,
        tickcolor: 'rgba(255, 255, 255, 0.75)',
        tickvals: ticks,
        ticktext: ticksText,
        ticklen: 3,
        tickangle: 0,
      },
      yaxis: {
        fixedrange: true,
        tickcolor: 'rgba(255, 255, 255, 0.75)',
        tickmode: 'auto',
        ticklen: 3,
        tickangle: 0,
      },
      margin: { t: 5, l: 50, b: 25, r: 25 },
      staticPlot: true,
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      font: {
        color: '#ffffff',
      },
      dragmode: false,
    }

    const options = {
      displayModeBar: false,
      responsive: true,
    }

    return <plotly
      traces={traces}
      layout={layout}
      options={options}
      class="h-full"
    ></plotly>
  }
})
