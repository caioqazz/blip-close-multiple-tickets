import React, { useState } from 'react'
import { Form, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { BdsButton, BdsInput, BdsIcon } from 'blip-ds/dist/blip-ds-react'

const CommandForm = ({ handleSubmit }) => {
  const [key, setkey] = useState<string>('')
  const [url, setUrl] = useState<string>('')

  const validateForm = () => {
    return !(key.length > 0 && url.length > 0)
  }

  return (
    <Form
      style={{ padding: '10px 0px' }}
      onSubmit={(e) => {
        handleSubmit(e, { key, url })
      }}
    >
      <Form.Group as={Row}>
        <Col sm="11">
          <BdsInput
            label="Url to send commands"
            placeholder="https://http.msging.net/commands"
            required
            value={url}
            onBdsChange={(e) => {
              setUrl(e.detail.value)
            }}
          />

          <br />
        </Col>
        <Col sm="1">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://forum.blip.ai/t/preciso-de-ajuda-com-blip-close-multiple-tickets/8634"
          >
            <BdsIcon
              size="large"
              name="info"
              theme="outline"
              aria-label="Ícone de informações"
            />
          </a>
        </Col>

        <Col sm="11">
          <BdsInput
            label="Header authentication (Authorization)"
            placeholder="Key bGFiqpolfyaW9u..."
            value={key}
            required
            onBdsChange={(e) => {
              setkey(e.detail.value)
            }}
          />
        </Col>
        <Col sm="1">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://help.blip.ai/hc/pt-br/articles/360058712774-Como-encontrar-a-API-KEY-do-meu-bot-"
          >
            <BdsIcon
              size="large"
              name="info"
              theme="outline"
              aria-label="Ícone de informações"
            />
          </a>
        </Col>
      </Form.Group>

      <BdsButton
        className="float-right"
        disabled={validateForm()}
        type="submit"
      >
        Load{' '}
      </BdsButton>
    </Form>
  )
}

CommandForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default CommandForm
