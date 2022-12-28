import React, { useEffect, useState } from 'react'
import 'blip-toolkit/dist/blip-toolkit.css'
import { BlipTable } from './components/BlipTable'
import PropTypes from 'prop-types'
import { sortData } from './util'
import { Button, Form, Row, Col, Badge } from 'react-bootstrap'
import { FilterForm } from './components/FilterForm'
import {
  FILTER_DEFAULT,
  TICKET_TABLE_MODEL,
  MODAL_DEFAULT,
  TAGS_DEFAULT,
} from './constants/constant'
import { JsonModal } from './components/JsonModal'
import { Filter } from './constants/entities'
import ReactGA from 'react-ga'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
function MainPage({ service, commomService, isHttp }) {
  const [selected, setSeleted] = useState([])
  const [filter, setFilter] = useState<Filter>(FILTER_DEFAULT)
  const [tickets, setTickets] = useState<Array<any>>([])
  const [tags, setTags] = useState<any>(TAGS_DEFAULT)
  const [selectedTag, setSelectedTag] = useState<string>()
  const [modal, setModal] = useState(MODAL_DEFAULT)

  const getTickets = async (): Promise<void> => {
    commomService.withLoading(async () => {
      setSeleted([])
      setTickets(await service.getTicketsPagination(filter))
    })
  }
  const getTags = async () => {
    const response = await service.getTags()

    setTags(response)
    if (response.isTagsRequired && response.hasTags && response.tags[0].text) {
      setSelectedTag(response.tags[0].text)
    }
  }
  const fetchApi = async (): Promise<void> => {
    await wait(100)
    await getTickets()
    await getTags()
  }

  const handleClosing = async (): Promise<void> => {
    ReactGA.event({
      category: 'Close Mutiple Ticket Project',
      action: `Close Tickets ${selected.length}`,
      label: isHttp ? 'Http' : 'Plugin',
    })

    let successNumber = 0
    const tag = selectedTag ? [selectedTag] : []
    for (const ticket of selected) {
      const result = filter.status.closedClient
        ? await service.closeTicketAlreadyClosedClient(ticket.id, tag)
        : await service.closeTicket(ticket.id, tag)

      if (result) successNumber++
    }

    if (successNumber > 0)
      commomService.showSuccessToast(`${successNumber} ticket(s) closed`)
    await getTickets()
  }

  const Tags = (): JSX.Element => {
    if (tags.isTagsRequired) {
      const options = tags.tags.map(({ text }) => (
        <option key={text}>{text}</option>
      ))
      return (
        <Form.Group
          style={{
            border: '1px solid lightgray',
            padding: '10px',
          }}
        >
          <Form.Label>
            Tag <Badge pill variant='info'>required</Badge>
          </Form.Label>
          <Form.Control
            onChange={(e) => {
              setSelectedTag(e.target.value)
            }}
            as="select"
            value={selectedTag}
            required={tags.isTagsRequired}
          >
            {options}
          </Form.Control>
        </Form.Group>
      )
    }

    return <></>
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
      <Row>
        <Col>
          <p> Click on tickets to see their information </p>
        </Col>
        <Col>
          <Tags />
        </Col>
      </Row>
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
  isHttp: PropTypes.bool.isRequired,
}
export default MainPage
