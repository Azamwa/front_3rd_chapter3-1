import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { Event, EventForm } from '../types';

interface OverlappingEventDialogProps {
  isOpen: boolean;
  close: () => void;
  overlappingEvents: Event[];
  // eslint-disable-next-line no-unused-vars
  saveEvent: (eventData: Event | EventForm) => Promise<void>;
}

export const OverlappingEventDialog = ({
  isOpen,
  close,
  overlappingEvents,
  saveEvent,
}: OverlappingEventDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => close}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            일정 겹침 경고
          </AlertDialogHeader>

          <AlertDialogBody>
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Text key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Text>
            ))}
            계속 진행하시겠습니까?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => close}>
              취소
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                close();
                // saveEvent({
                //   id: editingEvent ? editingEvent.id : undefined,
                //   title,
                //   date,
                //   startTime,
                //   endTime,
                //   description,
                //   location,
                //   category,
                //   repeat: {
                //     type: isRepeating ? repeatType : 'none',
                //     interval: repeatInterval,
                //     endDate: repeatEndDate || undefined,
                //   },
                //   notificationTime,
                // });
              }}
              ml={3}
            >
              계속 진행
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
