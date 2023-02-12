import { useState } from 'react'
import { rowType, Worker } from '../main'
import { WorkerList } from '../cmps/WorkerList'
import { Table } from '../cmps/Table'

import React from 'react'

interface WorkersTableProps {
  tableRaw: rowType[]
  workersRaw: Worker[]
}

export const WorkersTable: React.FC<WorkersTableProps> = ({
  tableRaw,
  workersRaw,
}) => {
  const [table, setTable] = useState(tableRaw)
  const [workers, setWorkers] = useState(workersRaw)

  return (
    <div className="workers-table">
      <Table table={table} setTable={setTable} />
      <button className="generator-btn">מילוי אוטומטי</button>
      <WorkerList workers={workers} setWorkers={setWorkers} />
    </div>
  )
}
//every worker has a rating per machine
//rating:
//if not worked in machine over 8 weeks = 100
//if worked in machine in last x weeks = x

//every worker has a rating per timeShift
//rating:
//every timeShift will timeShift++ in an array
//for every round of [1,1,1] (or higher) reduce by 1 all

//every machine has a rating for workers
//rating:
//if machine is rated x, x-1, x-2 ... => this is the order by which workers will be assigned(based on their own ratings for that specific machine)

//workers are pre-assigned their timeShift (//TODO: add this step)

//TODO LIST:
//1. add lock mechanism to cells
//2. add logic for generating the time shifts for the workers
//3. connect to the backend & add authentication to the app (maybe use SQL??)
