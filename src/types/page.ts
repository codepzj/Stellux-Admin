// 重新导出config类型以保持向后兼容性
import type {
  ConfigReq,
  Content,
  Repo,
  Skill,
  Timeline,
  ConfigVO,
  ConfigSummaryVO,
} from "./config";

export type PageConfigReq = ConfigReq;
export type PageContent = Content;
export type PageConfigVO = ConfigVO;
export type PageConfigSummaryVO = ConfigSummaryVO;
export type { Repo, Skill, Timeline };
