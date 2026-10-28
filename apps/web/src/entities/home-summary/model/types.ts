import { z } from "zod"
import { homeSummaryDtoSchema } from "./home-summary.schema"

export type HomeSummaryDto = z.infer<typeof homeSummaryDtoSchema>
