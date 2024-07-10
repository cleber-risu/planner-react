import { Mail, X } from "lucide-react";
import { Button } from "../../components/button";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

interface InviteNewGuestModalProps {
  closeNewGuestModal: () => void;
}

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

export function InviteNewGuestModal({
  closeNewGuestModal,
}: InviteNewGuestModalProps) {
  const { tripId } = useParams();

  const [trip, setTrip] = useState<Trip | undefined>();

  useEffect(() => {
    api.get(`/trips/${tripId}`).then((response) => setTrip(response.data.trip));
  }, [tripId]);

  async function inviteNewGuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    await api.post(`/trips/${tripId}/invites`, {
      email,
    });

    window.document.location.reload();
  }

  const displayedDate = trip
    ? format(trip.starts_at, "d' de 'LLL")
        .concat(" até ")
        .concat(format(trip.ends_at, "d' de 'LLL"))
    : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Convide alguém para a viagem
            </h2>
            <button onClick={closeNewGuestModal} type="button">
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Convidade alguém para participar de uma viagem para&nbsp;
            <span className="font-semibold text-zinc-100">
              {trip?.destination}
            </span>{" "}
            nas datas de{" "}
            <span className="font-semibold text-zinc-100">{displayedDate}</span>{" "}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={inviteNewGuest} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Mail className="text-zinc-400 size-5" />
            <input
              type="email"
              name="email"
              placeholder="Email do convidado"
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
            />
          </div>
          <Button variant="primary" size="full">
            Confirmar novo convite
          </Button>
        </form>
      </div>
    </div>
  );
}
