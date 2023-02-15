import { VictoryLabel, VictoryTooltip } from 'victory'

export const CustomLabel = (props: any) => {
  return (
    <g>
      <VictoryLabel
        {...props}
        text={({ datum }) =>
          datum.amountWorked > 0
            ? 'time' in datum
              ? datum.time === 'morning'
                ? 'בוקר'
                : datum.time === 'evening'
                ? 'ערב'
                : 'לילה'
              : datum.machine
            : ''
        }
      />
      <VictoryTooltip
        {...props}
        style={{
          labels: { opacity: 1 },
          fill: 'white',
          fontWeight: 700,
          fontFamily: 'Rubik',
          fontSize: 20,
        }}
        x={200}
        y={250}
        orientation="top"
        pointerLength={0}
        cornerRadius={50}
        flyoutWidth={100}
        flyoutHeight={100}
        flyoutStyle={{ fill: 'black' }}
      />
    </g>
  )
}

CustomLabel.defaultEvents = VictoryTooltip.defaultEvents
