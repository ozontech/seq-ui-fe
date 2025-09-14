import { Link, Copy, ChevronDown } from "lucide-vue-next";
import { computed, defineComponent } from "vue";
import type { Log } from "~/types/messages";
import { prop } from "@fe/prop-types";
import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/ui";
import router, { PAGES } from "~/router";
import { copyObjectToClipboard, copyToClipboard } from "~/helpers/clipboard";
import { toast } from "vue-sonner";
import { denormalizeMessage } from "~/normalizers/events";
import type { Option } from "~/types/input";
import { openSurroundingMessages } from "~/helpers/open-surrounding-messages";

const SURROUNDING_MESSAGES_OPTIONS: Option[] = [
	{ label: '1 second', value: '1' },
	{ label: '5 seconds', value: '5' },
	{ label: '10 seconds', value: '10' },
	{ label: '30 seconds', value: '30' },
	{ label: '1 minute', value: '60' },
	{ label: '5 minutes', value: '300' },
]

export const LogViewButtons = defineComponent({
  name: 'LogViewButtons',
  props: {
    log: prop<Log>().required(),
    query: prop<string>().optional(),
  },
  setup(props) {
    const isLogPage = computed(() => {
      return router.currentRoute.value.name === PAGES.Log
    })

    const permalink = computed(() => {
      return `${location.origin}/logs/${props.log._id}`
    })

    const handleLogOpen = () => {
      open(permalink.value)
    }

    const handleCopyPermalink = () => {
      copyToClipboard(permalink.value)
      toast.info('The link is successfully copied')
    }

    const handleCopyJSON = () => {
      copyObjectToClipboard(denormalizeMessage(props.log))
      toast.info('JSON successfully copied')
    }

    const handleSurroundingMessagesOpen = (seconds: string) => {
      openSurroundingMessages(props.log, seconds, props.query)
    }

    const renderOpenButton = () => {
      if (isLogPage.value) {
        return
      }

      return (
        <Button
          variant="secondary"
          whenClick={handleLogOpen}
        >Open in new tab
        </Button>
      )
    }

    const renderCopyPermalinkButton = () => {
      return (
        <Button
          variant="secondary"
          whenClick={handleCopyPermalink}
        >
          <Link size={16}/> Copy permalink
        </Button>
      )
    }

    const renderCopyJSONButton = () => {
      return (
        <Button
          variant="secondary"
          whenClick={handleCopyJSON}
        >
          <Copy size={16}/> Copy JSON
        </Button>
      )
    }

    const renderSurroundingMessagesButton = () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary">
              Show surrounding messages <ChevronDown/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
              SURROUNDING_MESSAGES_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  whenClick={() => handleSurroundingMessagesOpen(option.value)}
                >{ option.label }
                </DropdownMenuItem>
              ))
            }
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return () => (
      <div class="flex gap-[12px]">
        { renderOpenButton() }
        { renderCopyPermalinkButton() }
        { renderCopyJSONButton() }
        { renderSurroundingMessagesButton() }
      </div>
    )
  }
})
