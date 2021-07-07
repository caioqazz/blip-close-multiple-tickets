import React, { useEffect, useState } from 'react'
import 'blip-toolkit/dist/blip-toolkit.css'
import { BlipTable } from './components/BlipTable'
import PropTypes from 'prop-types'
import { sortData } from './util'
import { Button } from 'react-bootstrap'
import { FilterForm } from './components/FilterForm'
import { FILTER_DEFAULT, TICKET_TABLE_MODEL } from './constants/constant.json'
import { JsonModal } from './components/JsonModal'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
function MainPage({ service, commomService }) {
  // const [application, setApplication] = useState<Object>({})
  const [selected, setSeleted] = useState([])
  const [filter, setFilter] = useState(FILTER_DEFAULT)
  const [tickets, setTickets] = useState<Array<any>>([])
  const [modal, setModal] = useState({ position: 0, display: false, item: {} })

  const getTickets = async () => {
    console.log(filter)
    commomService.withLoading(async () => {
      setSeleted([])
      setTickets(await service.getTicketsPagination(filter))
    })
  }

  const fetchApi = async () => {
    await wait(100)
    await getTickets()
    // setApplication(await service.getApplication())
  }

  const handleClosing = async () => {
    let successNumber = 0
    for (const ticket of selected) {
      const result = filter.status.closedClient
        ? await service.closeTicketAlreadyClosedClient(ticket.id)
        : await service.closeTicket(ticket.id)

      if (result) successNumber++
    }

    if (successNumber > 0)
      commomService.showSuccessToast(`${successNumber} ticket(s) closed`)
    await getTickets()
  }

  useEffect(() => {
    fetchApi()
    // eslint-disable-next-line
  }, [service, commomService])

  return (
    <div id="tab-nav" className="bp-tabs-container">
      <JsonModal
        position={modal.position}
        display={modal.display}
        data={modal.item}
        handleClose={() => setModal({ ...modal, display: false })}
      />
      <h3>Tickets</h3>
      <FilterForm
        handleSubmit={getTickets}
        data={filter}
        handleChange={setFilter}
      />
      <br />
      <p> Click on tickets to see their information </p>
      <BlipTable
        idKey="id"
        model={TICKET_TABLE_MODEL}
        data={tickets}
        canSelect={true}
        onSortSet={(item) => {
          sortData(tickets, item)
        }}
        onItemClick={(event, item) => {
          setModal({
            position: event.nativeEvent.clientY,
            display: true,
            item: item,
          })
        }}
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
