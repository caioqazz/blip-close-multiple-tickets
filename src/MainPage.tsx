import React, { useEffect, useState } from 'react'
import 'blip-toolkit/dist/blip-toolkit.css'
import { BlipTable } from './components/BlipTable'
import { BlipTabs } from 'blip-toolkit'
import PropTypes from 'prop-types'
import { sortData } from './util'
import { Button } from 'react-bootstrap'
import { FilterForm } from './projectComponents/FilterForm'
import FilterConstant from './constants/FilterConstant.json'
const tableModel: Array<Object> = [
  { label: 'Sequential Id', key: 'sequentialId' },
  { label: 'Customer Identity', key: 'customerIdentity' },
  { label: 'Team', key: 'team' },
  { label: 'Open Date', key: 'openDate' },
  { label: 'Status', key: 'status' },
  { label: 'Last Client Message Date', key: 'lastMessageDate' },
]
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function MainPage({ service, commomService }) {
  const [application, setApplication] = useState<Object>({})
  const [selected, setSeleted] = useState([])
  const [filter, setFilter] = useState(FilterConstant)
  const [tickets, setTickets] = useState<Array<any>>([])
  const [modal, setModal] = useState({ position: 0, display: false, item: {} })

  const getTickets = async () => {
    console.log(filter)
    commomService.withLoading(async () => {
      setTickets(await service.getTicketsPagination(filter))
    })
  }

  const fetchApi = async () => {
    await wait(100)
    commomService.withLoading(async () => {
      setApplication(await service.getApplication())
      await getTickets()
    })
  }

  const handleClosing = async () => {
    // for (const item of selected) {
    //   let result = header.status.closedClient
    //     ? await closeTicketAlreadyClosedClient(
    //         header.key,
    //         header.url,
    //         item.id,
    //         handleError
    //       )
    //     : await closeTicket(header.key, header.url, item.id, handleError)
    //   if (result) {
    //     successNumber++
    //   }
    //   percentage = (successNumber / selected.length) * 100
    //   setPercentage(percentage.toFixed(2))
    // }
    // setPercentage(0)
    // setClosingProgress(false)
    // successNumber > 0 && toast.success(`${successNumber} ticket(s) closed`)
    // await loadData(header)
  }

  useEffect(() => {
    //  new BlipTabs('tab-nav')
    fetchApi()
  }, [commomService])

  return (
    <div id="tab-nav" className="bp-tabs-container">
      <h3>Tickets</h3>
      <FilterForm
        handleSubmit={getTickets}
        data={filter}
        handleChange={setFilter}
      />
      <p> Click on tickets to see their information </p>
      <BlipTable
        idKey="id"
        model={tableModel}
        data={tickets}
        canSelect={true}
        onSortSet={(item) => {
          sortData(tickets, item)
        }}
        // onItemClick={(event, item) => {
        //   setModal({
        //     position: event.nativeEvent.clientY,
        //     display: true,
        //     item: item,
        //   })
        // }}
        onItemSelect={(item) => setSeleted(item)}
        selectedItems={selected}
        bodyHeight="1300px"
        actions={[
          <Button key="123" variant="danger" onClick={handleClosing}>
            Close
          </Button>,
        ]}
      />
    </div>
  )
}
MainPage.propTypes = {
  service: PropTypes.elementType.isRequired,
  commomService: PropTypes.elementType.isRequired,
}
export default MainPage
